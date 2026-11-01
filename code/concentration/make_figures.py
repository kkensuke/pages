"""Regenerate the figures of posts/concentration.md.

Figures 1, 3 and 4 run the Python code blocks of the post unchanged, so the
images always match the code shown to readers. Figure 2 is drawn below, and
figure 5 is rendered from relations.mmd with the Mermaid CLI (mmdc).

Usage (from the repository root, needs numpy, scipy and matplotlib):
    python code/concentration/make_figures.py
"""
import re
import shutil
import subprocess
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import Rectangle

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
POST = ROOT / "posts" / "concentration.md"
OUT = ROOT / "public" / "images" / "concentration"

# Title of a code block in the post -> image it produces
BLOCK_IMAGES = {
    "concentration.py": "concentration_hist.png",  # figure 1
    "mcdiarmid.py": "mcdiarmid_ks.png",  # figure 3
    "tail_bounds.py": "tail_bounds.png",  # figure 4
}


def save(path):
    plt.tight_layout()
    plt.savefig(path, dpi=160, facecolor="white")
    plt.close("all")


def run_post_blocks():
    pattern = r"```python\[title=([^\],]+)[^\]]*\]\n(.*?)```"
    blocks = dict(re.findall(pattern, POST.read_text(encoding="utf-8"), re.S))
    show = plt.show
    try:
        for title, image in BLOCK_IMAGES.items():
            # The blocks end with plt.show(); save the figure there instead.
            plt.show = lambda path=OUT / image: save(path)
            exec(compile(blocks[title], title, "exec"), {"__name__": "__main__"})
    finally:
        plt.show = show


def draw_bounds(ax, y_min, y_max, t=1.0):
    y = np.linspace(y_min, y_max, 4001)
    ax.plot(y, (y >= t).astype(float), "k", lw=3,
            label=r"$\mathbf{1}_{\{y \geq t\}}$ (indicator)")
    y_pos = y[y >= 0]
    ax.plot(y_pos, y_pos / t, lw=2.2, color="tab:blue",
            label=r"Markov: $y/t$ (for $y \geq 0$)")
    ax.plot(y, (y / t) ** 2, lw=2.2, color="tab:orange",
            label=r"Chebyshev: $y^2/t^2$")
    for lam, ls in [(1.5, "-"), (4.0, "--")]:
        # Cap the exponent to avoid overflow; the curve is far above the axes there.
        ax.plot(y, np.exp(np.minimum(lam * (y - t), 50)), lw=2.2, ls=ls,
                color="tab:red", label=rf"Chernoff: $e^{{\lambda(y-t)}}$, $\lambda = {lam}$")
    ax.axvline(t, color="gray", lw=1, ls=":")
    ax.set_xlabel(r"$y$")


def draw_indicator_bounds():
    """Figure 2: (a) near the threshold t = 1 and (b) a wide range."""
    local, wide = ((-1.0, 1.5), (0.0, 2.0)), ((-4.0, 10.0), (0.0, 10.0))
    fig, (a, b) = plt.subplots(1, 2, figsize=(14, 5.4),
                               gridspec_kw={"width_ratios": [1, 1.25]})
    for ax, ((x0, x1), (y0, y1)), title in [
        (a, local, "(a) Near the threshold $t = 1$"),
        (b, wide, "(b) Wide range"),
    ]:
        draw_bounds(ax, x0, x1)
        ax.set(xlim=(x0, x1), ylim=(y0 - 0.02 * (y1 - y0), y1), title=title)
    (lx0, lx1), (ly0, ly1) = local
    b.add_patch(Rectangle((lx0, ly0), lx1 - lx0, ly1 - ly0,
                          fill=False, ls="--", lw=1.2, color="gray"))
    b.text(lx0, ly1 + 0.15, "(a)", color="gray", va="bottom")
    handles, labels = a.get_legend_handles_labels()
    fig.legend(handles, labels, loc="lower center", ncol=3, fontsize=13, frameon=False)
    fig.tight_layout(rect=(0, 0.13, 1, 1))
    fig.savefig(OUT / "indicator_bounds.png", dpi=160, facecolor="white")
    plt.close(fig)


def render_relations():
    """Figure 5: relationship diagram (needs the Mermaid CLI, mmdc)."""
    if shutil.which("mmdc") is None:
        print("Skipped figure 5: mmdc (Mermaid CLI) was not found.")
        return
    subprocess.run(["mmdc", "-i", str(HERE / "relations.mmd"),
                    "-o", str(OUT / "relations.png"), "-b", "white", "-s", "2"],
                   check=True)


if __name__ == "__main__":
    plt.rcParams.update({"font.size": 14, "figure.figsize": (8, 5)})
    OUT.mkdir(parents=True, exist_ok=True)
    run_post_blocks()
    draw_indicator_bounds()
    render_relations()
