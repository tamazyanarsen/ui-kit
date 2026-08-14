"""Перегенерация тестовой монохромной темы `[data-product="test-mono"]`.

Зачем она нужна — см. комментарий над самим блоком в src/index.css
(дизайн-чек №5): это «лакмусовая» палитра, в которой перекрашен каждый
цвет, поэтому любой элемент, оставшийся серым или синим, держит цвет
захардкоженным литералом вместо токена.

С появлением слоя палитры тема переопределяет ПАЛИТРУ, а не семантику:
раньше здесь было 443 строки (по одной на каждый семантический токен),
теперь ~62 — по одной на цвет, а семантика едет следом сама, потому что
ссылается на палитру через `var()`.

Запуск (из корня репозитория):

    python scripts/gen-mono-theme.py            # печатает блок
    python scripts/gen-mono-theme.py --write    # вписывает его в index.css
"""

import colorsys
import re
import sys
from pathlib import Path

CSS = Path(__file__).resolve().parent.parent / "src" / "index.css"

# Тон и насыщенность фиксированы — меняется только светлота, поэтому палитра
# читается как один цвет. 280° — фиолетовый, которого нет ни в одной из двух
# продуктовых тем, так что спутать его с настоящим брендом невозможно.
HUE = 280 / 360.0
SATURATION = 0.55
# Края диапазона: чистый белый и почти-чёрный иначе остались бы ахроматичными.
LIGHTNESS_MIN, LIGHTNESS_MAX = 0.12, 0.95

HEADER = """/* Тестовая монохромная палитра («Тест — монохром») — data-product="test-mono".
   Лакмус на захардкоженные цвета: перекрашена вся палитра, поэтому элемент,
   оставшийся серым или синим, держит цвет литералом мимо токенов.

   Переопределяется именно палитра — семантика ссылается на неё через var()
   и меняется сама. Значения механические: каждый исходный цвет переведён в
   HSL, светлота линейно отображена в диапазон 0.12–0.95, тон и насыщенность
   зафиксированы (H 280°, S 55%). Линейный ремап, а не обрезка по краям:
   обрезка схлопывала белый, #F8F8F8 и #FFF0F0 в один оттенок и прятала
   разницу между поверхностями.

   Перегенерировать: python scripts/gen-mono-theme.py --write */"""


def palette_tokens(css: str) -> list[tuple[str, str]]:
    """Пары (имя, hex) из блока палитры — он идёт до семантического :root."""
    start = css.index("/* ── Палитра")
    end = css.index(":root {\n  /* ЕЛК (default product theme)")
    return re.findall(r"--([a-z0-9-]+):\s*(#[0-9A-Fa-f]{6})\s*;", css[start:end])


def lightness(hex_value: str) -> float:
    r, g, b = (int(hex_value[i : i + 2], 16) / 255 for i in (1, 3, 5))
    return colorsys.rgb_to_hls(r, g, b)[1]


def build(css: str) -> str:
    tokens = palette_tokens(css)
    levels = {hex_value.upper(): lightness(hex_value) for _, hex_value in tokens}
    lo, hi = min(levels.values()), max(levels.values())

    def mono(hex_value: str) -> str:
        scaled = LIGHTNESS_MIN + (levels[hex_value.upper()] - lo) / (hi - lo) * (
            LIGHTNESS_MAX - LIGHTNESS_MIN
        )
        r, g, b = colorsys.hls_to_rgb(HUE, scaled, SATURATION)
        return "#{:02X}{:02X}{:02X}".format(round(r * 255), round(g * 255), round(b * 255))

    width = max(len(name) for name, _ in tokens) + 2
    lines = [HEADER, '[data-product="test-mono"] {']
    for name, hex_value in tokens:
        pad = " " * (width - len(name))
        lines.append(f"  --{name}:{pad}{mono(hex_value)}; /* {hex_value.upper()} */")
    lines.append("}")
    return "\n".join(lines)


def main() -> None:
    css = CSS.read_text(encoding="utf-8")
    block = build(css)

    if "--write" not in sys.argv:
        print(block)
        return

    marker = '[data-product="test-mono"]'
    if marker in css:
        start = css.rindex("/* Тестовая монохромная палитра", 0, css.index(marker))
        end = css.index("\n}", css.index(marker)) + 2
        css = css[:start] + block + "\n" + css[end:]
    else:
        css = css.rstrip("\n") + "\n\n" + block + "\n"
    CSS.write_text(css, encoding="utf-8")
    print(f"записано, строк в блоке: {block.count(chr(10)) + 1}")


if __name__ == "__main__":
    main()
