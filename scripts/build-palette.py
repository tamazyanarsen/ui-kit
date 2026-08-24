"""Сборка слоя палитры: hex -> имя переменной по именам Figma.

Зачем: цветовые токены кита семантические (`--btn-primary-bg`), а в Figma
цвета названы по палитре (`Base/Blue 223`). Правильный слой между ними —
палитра: 48 переменных с именами Figma, на которые ссылается вся семантика.
Переименовывать саму семантику нельзя: тема «Старые цвета» перекрашивает
primary в зелёный, а переменная с именем `blue-223` зелёной стать не может.

Имена берутся из таблицы в `colors.stories.tsx` (она собрана
`get_variable_defs` по компонент-сетам Figma). Цветам, которых в наборе
Figma не нашлось, имя выводится по правилу «число = контраст к белому × 100»
— оно сошлось на 36 из 40 известных цветов; семейство подбирается по
ближайшему тону среди уже названных.

Запуск (из корня репозитория):

    python scripts/build-palette.py            # печатает палитру
    python scripts/build-palette.py --json     # машиночитаемо
"""

import colorsys
import json
import re
import sys
from pathlib import Path

STYLES = Path("src/styles")
# Имена из набора Figma живут в самом `palette.ts` (поле `figma`) — он же и
# перезаписывается. Раньше источником была таблица в `colors.stories.tsx`, но
# история давно читает `PALETTE` из этого модуля, и таблицы там больше нет.
PALETTE_TS = Path("src/components/ui/colors/palette.ts")

# Стили разложены по файлам (см. src/index.css). Скрипту нужен один сплошной
# текст в том же порядке, что и в импортах, — иначе срезы между маркерами
# `--btn-primary-bg:` / `[data-product="odl-elk"]` / `[data-product="test-mono"]`
# теряют смысл.
CSS_ORDER = [
    "palette.css",
    "tokens-forms.css",
    "tokens-controls.css",
    "tokens-surfaces.css",
    "tokens-navigation.css",
    "tokens-content.css",
    "tokens-table.css",
    "theme-odl-elk.css",
    "theme-test-mono.css",
]


def read_css() -> str:
    return "\n".join(
        (STYLES / name).read_text(encoding="utf-8") for name in CSS_ORDER
    )


def rgb(hex_value: str):
    return tuple(int(hex_value[i : i + 2], 16) / 255 for i in (1, 3, 5))


def luminance(hex_value: str) -> float:
    def channel(c: float) -> float:
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4

    r, g, b = (channel(c) for c in rgb(hex_value))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast_number(hex_value: str) -> int:
    """Число в имени Figma: контраст к белому, умноженный на 100."""
    return int((1.05 / (luminance(hex_value) + 0.05)) * 100)


def hue_sat(hex_value: str):
    h, _, s = colorsys.rgb_to_hls(*rgb(hex_value))
    return h * 360, s


def var_name(figma: str) -> str:
    """`Second/Grey colors/Grey 1514` -> `grey-1514`."""
    leaf = figma.split("/")[-1].strip()
    return re.sub(r"\s+", "-", leaf).lower()


def family(name: str) -> str:
    return re.sub(r"-\d+$", "", name)


HEADER = """/* ── Палитра ──────────────────────────────────────────────────────────────
   Имена переменных ровно как в Figma: `Base/Blue 223` -> `--blue-223`,
   `Second/Grey colors/Grey 1514` -> `--grey-1514`. Это нижний слой: на него
   ссылается вся семантика ниже (`--btn-primary-bg: var(--blue-223)`), а
   компоненты по-прежнему используют семантические имена.

   Почему два слоя, а не одно переименование: тема «Старые цвета»
   перекрашивает primary в зелёный, и переменная с именем `blue-223`
   зелёной стать не может, не начав врать. В Figma ровно та же развязка —
   переменная палитры и ссылающаяся на неё заливка компонента.

   Цветам, которых в наборе Figma нет, имя выведено по правилу «число =
   контраст к белому × 100» (оно сошлось на 36 из 40 известных цветов), а
   семейство — по ближайшему тону; такие помечены `выведено`. Палитра
   старого бренда живёт под префиксом `odl-`: её имён из Figma у нас нет,
   и без префикса она конфликтует с новой (два разных «Red 182»).

   Перегенерировать: python scripts/build-palette.py --css */"""


def css_block(palette, derived, named) -> str:
    def sort_key(hex_value: str):
        name = palette[hex_value]
        return (name.startswith("odl-"), family(name), -luminance(hex_value))

    width = max(len(n) for n in palette.values()) + 2
    lines = [HEADER, ":root {"]
    current = None
    for hex_value in sorted(palette, key=sort_key):
        name = palette[hex_value]
        if family(name) != current:
            current = family(name)
            lines.append(f"  /* {current} */")
        note = "выведено" if hex_value in derived else named[hex_value]
        lines.append(f"  --{name}:{' ' * (width - len(name))}{hex_value}; /* {note} */")
    lines.append("}")
    return "\n".join(lines)


def ts_module(palette, derived, named, root: str, odl: str) -> str:
    """Данные для истории «Палитра»: имя, источник имени и кто ссылается."""
    users: "dict[str, list[str]]" = {}
    for token, ref in re.findall(r"--([a-z0-9-]+):\s*var\(--([a-z0-9-]+)\)\s*;", root):
        users.setdefault(ref, []).append(token)

    def sort_key(hex_value: str):
        name = palette[hex_value]
        return (name.startswith("odl-"), family(name), -luminance(hex_value))

    rows = []
    for hex_value in sorted(palette, key=sort_key):
        name = palette[hex_value]
        figma = "null" if hex_value in derived else f'"{named[hex_value]}"'
        used = users.get(name, [])
        # Одна строка на цвет: файл читается как таблица, а не как
        # полсотни развёрнутых объектов на четыреста строк.
        rows.append(
            f'  {{ name: "{name}", family: "{family(name)}", '
            f'hex: "{hex_value}", figma: {figma}, '
            f"usedBy: {json.dumps(used, ensure_ascii=False)} }},"
        )

    return (
        "// СГЕНЕРИРОВАНО: python scripts/build-palette.py --ts\n"
        "// Правьте палитру в src/styles/palette.css и перегенерируйте — руками\n"
        "// этот файл не редактируется. `figma: null` — имя выведено по правилу\n"
        "// контраста, а не взято из набора Figma.\n"
        "\nexport interface PaletteColor {\n"
        "  /** Имя CSS-переменной без `--`, как в Figma. */\n"
        "  name: string\n"
        "  family: string\n"
        "  /** Значение в теме ЕЛК; живое значение история читает из CSS. */\n"
        "  hex: string\n"
        "  /** Имя переменной в наборе Figma; null — выведено. */\n"
        "  figma: string | null\n"
        "  /** Семантические токены, которые на неё ссылаются. */\n"
        "  usedBy: string[]\n"
        "}\n\n"
        "export const PALETTE: PaletteColor[] = [\n" + "\n".join(rows) + "\n]\n"
    )


def main() -> None:
    known = PALETTE_TS.read_text(encoding="utf-8")
    named = {
        h.upper(): f
        for h, f in re.findall(r'hex: "(#[0-9A-Fa-f]{6})", figma: "([^"]+)"', known)
    }

    css = read_css()
    root = css[css.index("--btn-primary-bg:") : css.index('[data-product="odl-elk"]')]
    odl = css[css.index('[data-product="odl-elk"]') : css.index('[data-product="test-mono"]')]

    def hexes(block: str):
        seen = []
        for _, value in re.findall(r"--([a-z0-9-]+):\s*(#[0-9A-Fa-f]{6})\s*;", block):
            if value.upper() not in seen:
                seen.append(value.upper())
        return seen

    new_hexes = hexes(root)
    # Цвета, которые встречаются ТОЛЬКО в теме «Старые цвета», — это другая
    # палитра бренда, её имён в Figma у нас нет. Поэтому они уезжают под
    # префикс `odl-`: так видно, что имя выведено и относится к старому
    # набору, и не возникает коллизий вида «два разных Red 182».
    old_hexes = [h for h in hexes(odl) if h not in new_hexes]

    palette = {}
    derived = set()

    # 1) сначала всё, что названо в Figma — они же задают семейства
    for hex_value in new_hexes:
        if hex_value in named:
            palette[hex_value] = var_name(named[hex_value])

    families = {}
    for hex_value, name in palette.items():
        families.setdefault(family(name), []).append(hex_value)
    # Опорные тона для семейств, которых нет в новой палитре: старый бренд
    # держится на зелёном, а ближайшим по тону к нему оказывается yellow.
    HUE_ANCHORS = {"green": 100.0}

    def pick_family(hex_value: str) -> str:
        hue, sat = hue_sat(hex_value)
        if sat < 0.12:
            return "grey"
        best, best_d = "grey", 1e9
        candidates = [(fam, hue_sat(h)[0]) for fam, hs in families.items()
                      if fam not in {"grey", "white"} for h in hs if hue_sat(h)[1] >= 0.12]
        candidates += list(HUE_ANCHORS.items())
        for fam, other_hue in candidates:
            d = abs(((hue - other_hue + 180) % 360) - 180)
            if d < best_d:
                best, best_d = fam, d
        return best

    # 2) остальные — имя выводим: семейство по ближайшему тону, число по контрасту
    for hex_value, prefix in [(h, "") for h in new_hexes] + [(h, "odl-") for h in old_hexes]:
        if hex_value in palette:
            continue
        name = f"{prefix}{pick_family(hex_value)}-{contrast_number(hex_value)}"
        # Два разных цвета могут дать одинаковый контраст (например #FFE8E3
        # «Red 117» из набора и выведенный #FAE9EA). Число тут округлённое,
        # так что различить их правилом нельзя — помечаем суффиксом, чтобы
        # имя не выдавало себя за настоящее имя из Figma.
        if name in palette.values():
            base, n = name, 2
            name = f"{base}-alt"
            while name in palette.values():
                name = f"{base}-alt{n}"
                n += 1
        palette[hex_value] = name
        derived.add(hex_value)

    duplicates = [n for n in palette.values() if list(palette.values()).count(n) > 1]
    if duplicates:
        raise SystemExit(f"коллизия имён: {sorted(set(duplicates))}")

    if "--json" in sys.argv:
        print(json.dumps({"palette": palette, "derived": sorted(derived)}, indent=2))
        return

    if "--css" in sys.argv:
        print(css_block(palette, derived, named))
        return

    if "--ts" in sys.argv:
        out = Path("src/components/ui/colors/palette.ts")
        out.write_text(ts_module(palette, derived, named, root, odl), encoding="utf-8")
        print(f"записано: {out}")
        return

    def sort_key(hex_value: str):
        name = palette[hex_value]
        return (name.startswith("odl-"), family(name), -luminance(hex_value))

    order = sorted(palette, key=sort_key)
    current = None
    for hex_value in order:
        name = palette[hex_value]
        if family(name) != current:
            current = family(name)
            print(f"\n  /* {current} */")
        mark = "  <- выведено" if hex_value in derived else ""
        source = named.get(hex_value, "нет в наборе Figma")
        print(f"  --{name:16} {hex_value};  /* {source} */{mark}")
    print(f"\n  всего {len(palette)}, из них выведено {len(derived)}")


if __name__ == "__main__":
    main()
