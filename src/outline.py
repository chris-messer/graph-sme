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
        # vocabulary, the three layers the middle of the deck walks through, and
        # then every client need sorted into those three layers — an index the
        # presenter can jump from, so it closes the framing rather than opening
        # the taxonomy section.
        ("Framing", [
            "framing",
            "graph-101",
            "semantic-layers",
            "client-needs",
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
        # Just the concept now. The mechanism slide that used to sit under here
        # is unfinished and has moved to the appendix, so this run is the one
        # explainer and then straight into the two client needs.
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
        # The need and the destination: the corpus that fails, then the same
        # corpus as a graph. Neither slide has said yet how you get one.
        ("Connecting the dots", [
            "agent-disconnect",
            "graph-answer",
        ]),
        # A graph problem splits in two, and these two subsections are that
        # split — named in one word each so the rail carries the division
        # rather than a sentence about it. Construction first:
        # build-and-retrieve names both halves, build-options is the three ways
        # of getting entities and edges out of sources.
        ("Build", [
            "build-and-retrieve",
            "build-options",
        ]),
        # Then retrieval: the ways to walk what construction produced, and
        # where we land. Seed selection and hop volume are two problems inside
        # this half, and the appendix slide is the long form of both.
        ("Retrieve", [
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

    # Everything after the close. The rail renders a section per entry, so an
    # appendix is just a sixth one — it draws itself, and rail.css gives the
    # last section a compact treatment so the six labels still fit the band.
    ("Appendix", [
        # The appendix runs in the order the body does, so a pulled-out slide
        # sits here in the same relative place it sat there. Genie mechanics
        # came out of Ontology / "What it is", which precedes the retrieval
        # run, so it leads and problem-space keeps the last slot.
        #
        # Unfinished, and marked as such: its stem is listed in build.py's
        # WIP_STEMS, which stamps the watermark over it.
        ("Genie mechanics", [
            "genie-ontology",
        ]),
        # Pulled out of the retrieval run: it is the long form of the two
        # decisions inside a walk, kept for the rooms that want to go there.
        ("The two decisions", [
            "problem-space",
        ]),
    ]),
]
