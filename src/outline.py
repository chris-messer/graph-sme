"""Section / subsection map for the deck's position rail.

This is the single source of truth for the rail at the top of every slide. Add,
move or regroup slides here and `build.py` regenerates the rail; nothing about
the hierarchy is written into per-slide markup.

Slides are named by their **stem** — the filename slug with its `NN-` ordering
prefix removed — because those prefixes get renumbered whenever slides move and
a map keyed on them would rot on the next restructure. `title` here means
whichever file is currently `NN-title.html`.

build.py fails the build if a slide is missing from this map, listed twice,
listed but nonexistent, or if the order here disagrees with the deck order
(which would mean a subsection is not a contiguous run of slides).

Shape:  [ (section, [ (subsection, [stem, ...]), ... ]), ... ]
"""

OUTLINE = [
    ("Overview", [
        ("Opening", [
            "title",
            "agenda",
        ]),
        ("Framing", [
            "framing",
            "graph-101",
            "ladder",
            "semantic-layers",
        ]),
    ]),

    ("Taxonomy", [
        ("What it is", [
            "taxonomy-overview",
        ]),
        ("The hierarchy need", [
            "interconnectivity",
            "taxonomy-storage-patterns",
            "closure-joins",
        ]),
    ]),

    ("Ontology", [
        ("What it is", [
            "ontology-overview",
        ]),
        ("The two needs", [
            "genie-ontology-path",
            "ontology-design",
            "ontology-options",
        ]),
    ]),

    ("Knowledge graphs", [
        ("What it is", [
            "kg-overview",
        ]),
        # The consolidated arc is deliberately one subsection: seed selection and
        # hop retrieval are two problems inside a single need, and the rail
        # should show these seven slides as one thing.
        ("Connecting the dots", [
            "agent-disconnect",
            "graph-answer",
            "problem-space",
            "seed-options",
            "hop-options",
            "retrieval-recommendation",
            "memory-options",
        ]),
        ("Algorithms", [
            "graph-algorithms",
            "algorithm-engines",
        ]),
        ("Extreme scale", [
            "extreme-scale",
        ]),
        ("GNNs", [
            "gnn",
            "gnn-options",
        ]),
    ]),

    ("Next steps", [
        ("Operating rules", [
            "operating-rule",
        ]),
        ("Discussion", [
            "discussion",
            "close",
        ]),
    ]),
]
