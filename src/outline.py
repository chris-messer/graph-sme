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
        # The climb used to sit here and now closes the deck, so this run is
        # purely the setup: why the request usually is not a graph estate, the
        # vocabulary, and the three layers the middle of the deck walks through.
        ("Framing", [
            "framing",
            "graph-101",
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
        # Two client needs and no options slide: the tooling answer now lands
        # inside the second need rather than as a survey after it.
        ("The two needs", [
            "genie-ontology-path",
            "ontology-design",
        ]),
    ]),

    ("Knowledge graphs", [
        ("What it is", [
            "kg-overview",
        ]),
        # One need, its two decisions, the options and the recommendation —
        # deliberately one subsection, because seed selection and hop retrieval
        # are two problems inside a single need rather than two needs.
        ("Connecting the dots", [
            "agent-disconnect",
            "graph-answer",
            "problem-space",
            "hop-options",
            "retrieval-recommendation",
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
        # The climb is the closing synthesis: it reads the whole deck back as
        # three rungs before the operating rule turns that into a way to work.
        ("Where you land", [
            "ladder",
        ]),
        ("Operating rules", [
            "operating-rule",
        ]),
        ("Discussion", [
            "discussion",
            "close",
        ]),
    ]),
]
