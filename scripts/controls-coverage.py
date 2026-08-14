"""Что из пропов компонента не выведено в контролы его истории.

Сверка контролов с Figma начинается отсюда: если проп вообще не выведен в
Controls, то и свойству Figma он соответствовать не может. Скрипт находит
для каждой истории её компонент, вытаскивает поля его `*Props`-интерфейса и
сравнивает с ключами `argTypes` + `args`.

Не считаются пробелами: `className`, `children`, `ref`, обработчики `on*`,
и управляемые двойники (`value` при наличии `defaultValue` и наоборот) —
их достаточно покрыть одним контролом.

Запуск (из корня репозитория):

    python scripts/controls-coverage.py
    python scripts/controls-coverage.py --all   # включая истории без пробелов
"""

import re
import sys
from pathlib import Path

SKIP = {
    "className",
    "containerClassName",
    "children",
    "ref",
    "key",
    "style",
    "asChild",
    "render",
}


def props_of(interface_body: str) -> list[str]:
    """Имена полей интерфейса верхнего уровня."""
    names = []
    depth = 0
    for line in interface_body.split("\n"):
        stripped = line.strip()
        if not stripped or stripped.startswith(("//", "*", "/*")):
            continue
        if depth == 0:
            m = re.match(r"(?:readonly\s+)?([A-Za-z_$][\w$]*)\??\s*:", stripped)
            if m:
                names.append(m.group(1))
        depth += stripped.count("{") - stripped.count("}")
    return names


def find_interface(text: str, name: str) -> str | None:
    m = re.search(rf"\binterface\s+{re.escape(name)}\b[^{{]*\{{", text)
    if not m:
        return None
    start = m.end() - 1
    depth = 0
    for i in range(start, len(text)):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                return text[start + 1 : i]
    return None


def declared_keys(story: str) -> set[str]:
    keys: set[str] = set()
    for block in ("argTypes", "args"):
        m = re.search(rf"\b{block}:\s*\{{", story)
        if not m:
            continue
        start = m.end() - 1
        depth = 0
        for i in range(start, len(story)):
            if story[i] == "{":
                depth += 1
            elif story[i] == "}":
                depth -= 1
                if depth == 0:
                    body = story[start : i + 1]
                    break
        else:
            continue
        depth = 0
        for j, ch in enumerate(body):
            if ch in "{[(":
                depth += 1
            elif ch in "}])":
                depth -= 1
            elif depth == 1:
                m2 = re.match(r'\s*(?:"([^"]+)"|([A-Za-z_$][\w$]*))\s*:', body[j:])
                if m2:
                    keys.add(m2.group(1) or m2.group(2))
    return keys


def main() -> None:
    show_all = "--all" in sys.argv
    total_gaps = 0

    for story_path in sorted(Path("src").rglob("*.stories.tsx")):
        story = story_path.read_text(encoding="utf-8")
        comp = re.search(r"\bcomponent:\s*([A-Za-z_$][\w$]*)", story)
        if not comp:
            continue
        name = comp.group(1)

        # интерфейс ищем сначала рядом (демо-обёртка), потом в модуле компонента
        body = find_interface(story, f"{name}Props")
        source = story_path.name
        if body is None:
            for sibling in story_path.parent.glob("*.tsx"):
                if sibling.name.endswith(".stories.tsx"):
                    continue
                text = sibling.read_text(encoding="utf-8")
                body = find_interface(text, f"{name}Props") or find_interface(
                    text, f"{name}OwnProps"
                )
                if body:
                    source = sibling.name
                    break
        if body is None:
            continue

        props = [p for p in props_of(body) if p not in SKIP and not p.startswith("on")]
        keys = declared_keys(story)
        missing = []
        for prop in props:
            if prop in keys:
                continue
            twin = f"default{prop[0].upper()}{prop[1:]}"
            if twin in keys or (prop.startswith("default") and prop[7].lower() + prop[8:] in keys):
                continue
            missing.append(prop)

        if missing or show_all:
            total_gaps += len(missing)
            mark = "  ПРОБЕЛЫ" if missing else "  ок"
            print(f"\n{story_path.as_posix()}  [{name} <- {source}]{mark}")
            if missing:
                print(f"    не выведено: {', '.join(missing)}")

    print(f"\nвсего пропов без контрола: {total_gaps}")


if __name__ == "__main__":
    main()
