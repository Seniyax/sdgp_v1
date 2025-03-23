# src/ml_model/train.py
import pickle
import numpy as np
from sklearn.linear_model import LinearRegression

# Create dummy training data
# Features: [group_size, slot_type, weekday, start_time_minutes]
# For simplicity, assume:
#   Casual reservations around 12:00 (720 minutes)
#   Fine dining reservations around 19:00 (1140 minutes)
#   Buffet reservations around 13:00 (780 minutes)

# Casual samples (slot_type 0)
X_casual = np.array([
    [2, 0, 0, 720],  # Monday, 2 people, casual, starting at 12:00
    [4, 0, 1, 730],  # Tuesday
    [6, 0, 2, 740],  # Wednesday
    [3, 0, 3, 720],  # Thursday
    [5, 0, 4, 730],  # Friday
])
y_casual = np.array([60, 65, 70, 55, 68])  # durations in minutes

# Fine dining samples (slot_type 1)
X_fine = np.array([
    [2, 1, 2, 1140],  # Wednesday, starting at 19:00
    [4, 1, 3, 1155],  # Thursday, starting at 19:15
    [6, 1, 4, 1170],  # Friday, starting at 19:30
    [3, 1, 5, 1190],  # Saturday, starting at 19:50
    [5, 1, 6, 1185],  # Sunday, starting at 19:45
])
y_fine = np.array([100, 110, 120, 90, 115])

# Buffet samples (slot_type 2)
X_buffet = np.array([
    [2, 2, 0, 780],   # Monday, starting at 13:00
    [4, 2, 1, 795],   # Tuesday, starting at 13:15
    [6, 2, 2, 810],   # Wednesday, starting at 13:30
    [3, 2, 3, 780],   # Thursday, starting at 13:00
    [5, 2, 4, 825],   # Friday, starting at 13:45
])
y_buffet = np.array([50, 60, 65, 55, 62])

# Combine all samples
X = np.concatenate((X_casual, X_fine, X_buffet), axis=0)
y = np.concatenate((y_casual, y_fine, y_buffet), axis=0)

# Train a simple linear regression model
model = LinearRegression()
model.fit(X, y)

# Save the model (ensure the path is correct relative to project root)
model_path = "src/ml_model/model.pkl"
with open(model_path, "wb") as f:
    pickle.dump(model, f)

print("Model trained and saved as model.pkl!")
