"""Свод контролов Storybook: что сейчас выведено в панель Controls.

Парой к `figma-variant-props.py` — тот печатает свойства компонент-сетов
Figma, этот печатает то же самое со стороны историй. Вместе они дают
сверку «контролы повторяют свойства компонента в Figma».

Разбор нарочно текстовый, а не через импорт модуля: истории тянут за собой
React и alias `@/`, а нам нужны только ключи `argTypes`, их `options`
и `name`. Скобочный баланс считается вручную, поэтому вложенные объекты
(`control: { type: "range" … }`) не ломают разбор.

Запуск (из корня репозитория):

    python scripts/story-controls.py            # все истории
    python scripts/story-controls.py button     # фильтр по пути
"""

import re
import sys
from pathlib import Path

STORIES = Path("src").rglob("*.stories.tsx")


def block(text: str, start: int) -> str:
    """Текст сбалансированного `{…}`, начиная с позиции первой скобки."""
    depth = 0
    for i in range(start, len(text)):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                return text[start : i + 1]
    return text[start:]


def entries(body: str):
    """Ключи верхнего уровня объекта и их значения."""
    out = []
    depth = 0
    key = None
    value_start = 0
    i = 0
    while i < len(body):
        ch = body[i]
        if ch in "{[(":
            depth += 1
        elif ch in "}])":
            depth -= 1
        elif depth == 1 and key is None:
            m = re.match(r'\s*(?:"([^"]+)"|([A-Za-z_$][\w$]*))\s*:', body[i:])
            if m:
                key = m.group(1) or m.group(2)
                i += m.end()
                value_start = i
                continue
        elif depth == 1 and ch == "," and key is not None:
            out.append((key, body[value_start:i].strip()))
            key = None
        i += 1
    if key is not None:
        out.append((key, body[value_start:].strip().rstrip("}").strip()))
    return out


def summarise(value: str) -> str:
    options = re.search(r"options:\s*(\[[^\]]*\])", value, re.S)
    control = re.search(r'control:\s*"([^"]+)"', value)
    control_obj = re.search(r'control:\s*\{\s*type:\s*"([^"]+)"', value)
    name = re.search(r'name:\s*"([^"]+)"', value)
    mapping = "mapping:" in value
    off = re.search(r"control:\s*false", value)

    bits = []
    if name:
        bits.append(f'"{name.group(1)}"')
    if off:
        bits.append("control: false")
    elif control:
        bits.append(control.group(1))
    elif control_obj:
        bits.append(control_obj.group(1))
    if options:
        flat = " ".join(options.group(1).split())
        bits.append(flat if len(flat) < 130 else flat[:127] + "…]")
    if mapping:
        bits.append("+mapping")
    return "  ".join(bits) or value.split("\n")[0][:60]


def main() -> None:
    wanted = [arg.lower() for arg in sys.argv[1:]]

    for path in sorted(STORIES):
        if wanted and not any(w in str(path).lower() for w in wanted):
            continue
        text = path.read_text(encoding="utf-8")

        title = re.search(r'title:\s*"([^"]+)"', text)
        print(f"\n=== {path.as_posix()}  [{title.group(1) if title else '?'}]")

        at = re.search(r"\bargTypes:\s*\{", text)
        if not at:
            print("    (нет argTypes)")
            continue
        body = block(text, at.end() - 1)
        for key, value in entries(body):
            print(f"    {key}: {summarise(value)}")

        ar = re.search(r"\n  args:\s*\{", text)
        if ar:
            keys = [k for k, _ in entries(block(text, ar.end() - 1))]
            print(f"    args: {', '.join(keys)}")


if __name__ == "__main__":
    main()
