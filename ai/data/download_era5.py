import cdsapi
import os

os.makedirs("data/raw", exist_ok=True)

c = cdsapi.Client()

REGIONS = {
    "mekong_delta": {
        "area": [12.0, 103.0, 8.0, 107.0],
        "output_prefix": "data/raw/era5_mekong_delta",
    },
    "mekong_upstream_asean": {
        "area": [22.0, 97.0, 12.0, 107.0],
        "output_prefix": "data/raw/era5_mekong_upstream_asean",
    },
    "langat_basin": {
        "area": [3.5, 101.0, 2.5, 102.5],
        "output_prefix": "data/raw/era5_langat",
    },
}

YEARS = [str(y) for y in range(2015, 2025)]
MONTHS = [f"{m:02d}" for m in range(1, 13)]
TIMES = ["00:00", "06:00", "12:00", "18:00"]

VARIABLES = [
    "10m_u_component_of_wind",
    "10m_v_component_of_wind",
    "total_precipitation",
    "surface_pressure",
    "2m_temperature",
]

for region_name, config in REGIONS.items():
    for year in YEARS:
        output_file = f"{config['output_prefix']}_{year}.nc"

        # Skip if already downloaded
        if os.path.exists(output_file):
            print(f"⏭️  Already exists, skipping: {output_file}")
            continue

        print(f"\n📥 Downloading: {region_name} — {year}")
        print(f"   Saving to: {output_file}")

        c.retrieve(
            "reanalysis-era5-single-levels",
            {
                "product_type": "reanalysis",
                "variable": VARIABLES,
                "year": year,
                "month": MONTHS,
                "day": [f"{d:02d}" for d in range(1, 32)],
                "time": TIMES,
                "area": config["area"],
                "format": "netcdf",
            },
            output_file,
        )

        print(f"✅ Done: {region_name} {year}")

print("\n🎉 All ERA5 downloads complete!")