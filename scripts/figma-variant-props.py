"""Свод свойств компонент-сетов Figma из дампов `get_metadata`.

Зачем: контролы в Storybook должны повторять набор свойств компонента в
Figma. Чтобы это можно было проверять, а не помнить, скрипт вытаскивает из
сохранённых дампов канвасов все компонент-сеты (`ELK / …`, `… (ELK)`) и их
матрицу вариантов: имя свойства → множество значений.

Дампы появляются сами: `mcp__figma__get_metadata` на целый канвас
переполняет лимит ответа и сохраняется в
`.claude/projects/<проект>/<сессия>/tool-results/*.txt` (JSON вида
`[{type, text}]`). Скрипт сканирует все такие файлы разом.

Запуск (из корня репозитория):

    python scripts/figma-variant-props.py                # все канвасы
    python scripts/figma-variant-props.py button input   # фильтр по имени
"""

import json
import re
import sys
from collections import OrderedDict
from pathlib import Path

DUMPS = Path.home() / ".claude" / "projects" / "C--Users-tamaz-projects-work-temp"

SET_NAME = re.compile(r"^(?:\d+\.\s*)?(?:ELK\s*/\s*(?P<a>.+)|(?P<b>.+?)\s*\(ELK\))$")


def load(path: Path) -> str:
    raw = path.read_text(encoding="utf-8", errors="replace")
    if raw.lstrip().startswith("["):
        try:
            return "".join(chunk.get("text", "") for chunk in json.loads(raw))
        except ValueError:
            return raw
    return raw


def indent(line: str) -> int:
    return len(line) - len(line.lstrip())


def variant_sets(text: str):
    """[(имя сета, OrderedDict свойство -> [значения])] в порядке появления."""
    lines = text.split("\n")
    found = []

    for i, line in enumerate(lines):
        node = re.match(r'\s*<(\w+) id="([^"]+)" name="([^"]+)"', line)
        if not node:
            continue
        name = node.group(3).strip()
        if not SET_NAME.match(name):
            continue

        # Символы строго внутри этого узла — до первой строки того же или
        # меньшего отступа.
        base = indent(line)
        props: "OrderedDict[str, list[str]]" = OrderedDict()
        for sub in lines[i + 1 :]:
            if sub.strip() and indent(sub) <= base:
                break
            sym = re.match(r'\s*<symbol id="[^"]+" name="([^"]+)"', sub)
            if not sym:
                continue
            for pair in sym.group(1).split(", "):
                if "=" not in pair:
                    continue
                key, value = pair.split("=", 1)
                bucket = props.setdefault(key.strip(), [])
                if value.strip() not in bucket:
                    bucket.append(value.strip())
        if props:
            found.append((name, props))
    return found


def main() -> None:
    wanted = [arg.lower() for arg in sys.argv[1:]]

    # Один канвас часто лежит в нескольких дампах — берём самый полный.
    best: "dict[str, tuple[int, str, str]]" = {}
    for path in sorted(DUMPS.glob("*/tool-results/*")):
        text = load(path)
        canvas = re.search(r'<canvas id="([^"]+)" name="([^"]+)"', text)
        if not canvas:
            continue
        cid, title = canvas.group(1), canvas.group(2).strip()
        if cid not in best or len(text) > best[cid][0]:
            best[cid] = (len(text), title, text)

    for cid, (_, title, text) in sorted(best.items()):
        if wanted and not any(w in title.lower() for w in wanted):
            continue

        sets = variant_sets(text)
        if not sets:
            continue
        print(f"\n=== {cid}  {title}")
        seen = set()
        for name, props in sets:
            if name in seen:
                continue
            seen.add(name)
            print(f"  {name}")
            for key, values in props.items():
                shown = ", ".join(values[:12]) + (" …" if len(values) > 12 else "")
                print(f"      {key}: {shown}")


if __name__ == "__main__":
    main()
