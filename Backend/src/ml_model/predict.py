# src/ml_model/predict.py
import sys
import os
import pickle
import datetime
import numpy as np

# Determine the absolute path for the model
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, "model.pkl")

if not os.path.exists(model_path):
    print(f"Error: model.pkl not found at {model_path}")
    sys.exit(1)

with open(model_path, "rb") as f:
    model = pickle.load(f)

# Ensure we have four input arguments: group_size, slot_type, date, and time.
if len(sys.argv) < 5:
    print("Error: Not enough input arguments.")
    sys.exit(1)

# Parse group_size
try:
    group_size = int(sys.argv[1])
except Exception as e:
    print("Invalid group size:", e)
    sys.exit(1)

# Parse slot_type and map it to a number
slot_type = sys.argv[2]
slot_mapping = {
    "casual": 0,
    "fine_dining": 1,
    "buffet": 2,
}
encoded_slot = slot_mapping.get(slot_type.lower(), -1)
if encoded_slot == -1:
    print("Unknown slot type")
    sys.exit(1)

# Parse date to extract weekday
date_str = sys.argv[3]
try:
    date_obj = datetime.datetime.strptime(date_str, "%Y-%m-%d")
    weekday = date_obj.weekday()  # Monday = 0, Sunday = 6
except Exception as e:
    print("Invalid date format:", e)
    sys.exit(1)

# Parse time (expected format: HH:MM:SS) to minutes since midnight
time_str = sys.argv[4]
try:
    time_obj = datetime.datetime.strptime(time_str, "%H:%M:%S")
    start_time_minutes = time_obj.hour * 60 + time_obj.minute
except Exception as e:
    print("Invalid time format:", e)
    sys.exit(1)

# Prepare input feature vector: [group_size, encoded_slot, weekday, start_time_minutes]
input_features = np.array([[group_size, encoded_slot, weekday, start_time_minutes]])

# Predict the duration in minutes
try:
    predicted_duration = model.predict(input_features)[0]  # in minutes
except Exception as e:
    print("Prediction error:", e)
    sys.exit(1)

# Compute finishing time (start time + duration) in minutes since midnight
finishing_time_minutes = (start_time_minutes + predicted_duration) % 1440  # wrap around midnight if needed

# Convert finishing time to HH:MM:SS format
hours = int(finishing_time_minutes // 60)
minutes = int(finishing_time_minutes % 60)
seconds = 0  # we assume whole minutes for simplicity
finishing_time_str = f"{hours:02d}:{minutes:02d}:{seconds:02d}"

print(finishing_time_str)
