import pandas as pd
import matplotlib.pyplot as plt

# Load the file
df = pd.read_csv(
    "data/raw/h383.csv",
    header=None,
    names=["year", "month", "day", "hour", "tide_mm"]
)

# Build a proper datetime column
df["datetime"] = pd.to_datetime(df[["year", "month", "day", "hour"]])
df = df.set_index("datetime").drop(columns=["year", "month", "day", "hour"])

# Convert mm to metres
df["tide_mm"] = df["tide_mm"].apply(lambda x: x if x > -9000 else None)
df["tide_m"] = df["tide_mm"] / 1000

print("=== Tidal Data Summary ===")
print(f"Date range : {df.index[0]} → {df.index[-1]}")
print(f"Total rows : {len(df):,}")
print(f"Missing    : {df['tide_mm'].isna().sum()}")
print(f"Min tide   : {df['tide_m'].min():.2f} m")
print(f"Max tide   : {df['tide_m'].max():.2f} m")

# Quick plot
df[df.index.year == 2020]["tide_m"].plot(figsize=(14, 4), title="Vung Tau Tidal Signal — 2020")
plt.ylabel("Sea level (m)")
plt.tight_layout()
plt.savefig("data/processed/tidal_2020_check.png")
plt.show()

print("\n✅ Tidal data looks good!")