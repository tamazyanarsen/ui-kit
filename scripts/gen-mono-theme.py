"""Перегенерация тестовой монохромной темы `[data-product="test-mono"]` в src/index.css.

Зачем она нужна — см. комментарий над самим блоком в index.css (дизайн-чек №5):
это «лакмусовая» палитра, в которой перекрашен каждый цветовой токен, поэтому
любой элемент, оставшийся серым или синим, держит цвет захардкоженным литералом
вместо токена.

Запуск (из корня репозитория):

    python scripts/gen-mono-theme.py

Скрипт читает исходные значения из :root, печатает готовый CSS-блок в stdout и
НЕ трогает index.css сам — вставьте вывод на место существующего блока вручную,
чтобы случайная правка не затёрла комментарий.
"""

import colorsys
import re
from pathlib import Path

CSS = Path(__file__).resolve().parent.parent / "src" / "index.css"

# Тон и насыщенность фиксированы — меняется только светлота, поэтому палитра
# читается как один цвет. 280° — фиолетовый, которого нет ни в одной из двух
# продуктовых тем, так что спутать его с настоящим брендом невозможно.
HUE = 280 / 360.0
SATURATION = 0.55
# Края диапазона: чистый белый и почти-чёрный иначе остались бы ахроматичными.
LIGHTNESS_MIN, LIGHTNESS_MAX = 0.12, 0.95


def source_tokens(css: str) -> list[tuple[str, str]]:
    """Пары (имя токена, hex) из :root — до начала темы odl-elk."""
    start = css.index("--btn-primary-bg:")
    end = css.index('[data-product="odl-elk"]')
    return re.findall(r"--([a-z0-9-]+):\s*(#[0-9A-Fa-f]{6})\s*;", css[start:end])


def lightness(hex_value: str) -> float:
    r, g, b = (int(hex_value[i : i + 2], 16) / 255 for i in (1, 3, 5))
    return colorsys.rgb_to_hls(r, g, b)[1]


def main() -> None:
    css = CSS.read_text(encoding="utf-8")
    tokens = source_tokens(css)

    unique = {hex_value.upper() for _, hex_value in tokens}
    levels = {hex_value: lightness(hex_value) for hex_value in unique}
    lo, hi = min(levels.values()), max(levels.values())

    def mono(hex_value: str) -> str:
        # Линейный ремап, а не обрезка по краям: обрезка схлопывала белый,
        # #F8F8F8 и #FFF0F0 в один оттенок и прятала разницу между
        # поверхностями. Ремап сохраняет исходный порядок по светлоте.
        scaled = LIGHTNESS_MIN + (levels[hex_value] - lo) / (hi - lo) * (LIGHTNESS_MAX - LIGHTNESS_MIN)
        r, g, b = colorsys.hls_to_rgb(HUE, scaled, SATURATION)
        return "#{:02X}{:02X}{:02X}".format(round(r * 255), round(g * 255), round(b * 255))

    palette = {hex_value: mono(hex_value) for hex_value in unique}
    for name, hex_value in tokens:
        print(f"  --{name}: {palette[hex_value.upper()]}; /* {hex_value.upper()} */")


if __name__ == "__main__":
    main()
