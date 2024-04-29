fn main(emissions: u32, emissionsCategory: pub str<9>) {
    // write switch case for the emissions,waste and category
    if (emissions >= 501) {
        assert(emissionsCategory == "__high___");
    } else if (emissions >= 101) {
        assert(emissionsCategory == "__medium_");
    } else if (emissions >= 0) {
        assert(emissionsCategory == "__low____");
    } else {
        assert(false);
    }
}

// Emissions Categories:
// Low: 0-100 tons/year
// Medium: 101-500 tons/year
// High: 501+ tons/year