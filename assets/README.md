Original, pre-compression source files for media used on the site.
Kept for future re-processing if a different crop/quality/format is
ever needed. Not part of the deployed site — see public/ for the
optimized versions actually served to visitors.

_derived/ holds compressed files that were once served from public/ but are no
longer referenced — kept rather than deleted so a previous build can be restored
without re-running the export pipeline. frames/_derived/stari-mayr-mobile-scroll
is the mobile scroll-hero sequence, retired in v25 when mobile moved to a static
hero image.
