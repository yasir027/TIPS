import cv2
import mediapipe as mp
import numpy as np
# Initialize Mediapipe Hands and OpenCV
mp_hands = mp.solutions.hands
hands = mp_hands.Hands()
mp_draw = mp.solutions.drawing_utils
cap = cv2.VideoCapture(0)
# Button Stability Settings
button_positions = []
stable_positions = []
lost_detection_counter = 0
lost_detection_threshold = 5 # Allow temporary loss of detection
max_button_distance = 200 # Maximum size of detected button to filter close objects
# IR Grid Stability Settings
ir_positions = []
stable_ir_positions = []
lost_ir_counter = 0
lost_ir_threshold = 3 # Allow short loss of IR detection
while cap.isOpened():
 ret, frame = cap.read()
 if not ret:
 break
 frame = cv2.flip(frame, 1) # Mirror the webcam view
 h, w, _ = frame.shape
 # Convert frame to HSV for IR light detection
 hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
 # Define IR light range (adjust based on your camera's IR sensitivity)
 lower_ir = np.array([0, 0, 240]) # Bright white light
 upper_ir = np.array([180, 50, 255]) # Tolerant to IR bright spots
 # Mask for detecting IR light
 ir_mask = cv2.inRange(hsv, lower_ir, upper_ir)
 # Detect contours in the IR mask
 contours, _ = cv2.findContours(ir_mask, cv2.RETR_EXTERNAL,
cv2.CHAIN_APPROX_SIMPLE)
 detected_ir_points = []
 for cnt in contours:
 area = cv2.contourArea(cnt)
 if area > 100: # Filter small noise
 x, y, w_rect, h_rect = cv2.boundingRect(cnt)
 detected_ir_points.append((x, y, w_rect, h_rect))
 # Stabilize IR Grid Points
 if detected_ir_points:
 ir_positions = detected_ir_points
 lost_ir_counter = 0 # Reset the counter when IR points are detected
 else:
 lost_ir_counter += 1
 # Retain stable IR points if detection is consistent
 if lost_ir_counter < lost_ir_threshold:
 stable_ir_positions = ir_positions
 # Convert frame to grayscale and apply threshold for paper detection
 gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
 _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)
 # Use morphological operations to clean up noise
 kernel = np.ones((5, 5), np.uint8)
 thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
 # Detect contours for paper-drawn buttons
 contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
 detected_buttons = []
 for cnt in contours:
 area = cv2.contourArea(cnt)
 approx = cv2.approxPolyDP(cnt, 0.02 * cv2.arcLength(cnt, True), True)
 # Check for rectangular shapes and apply distance filtering
 if len(approx) == 4 and area > 1000: # Quadrilateral contour with significant area
 x, y, w_rect, h_rect = cv2.boundingRect(approx)
 # Ignore buttons that are too close or too small
 if w_rect < max_button_distance and h_rect < max_button_distance:
 detected_buttons.append((x, y, w_rect, h_rect))
 # If buttons are detected, update stable positions
 if detected_buttons:
 button_positions = detected_buttons
 lost_detection_counter = 0 # Reset the counter when buttons are detected
 else:
 lost_detection_counter += 1
 # If no detection for a while, retain the last known positions
 if lost_detection_counter < lost_detection_threshold:
 stable_positions = button_positions
 # Draw detected/stable buttons
 for x, y, w_rect, h_rect in stable_positions:
 cv2.rectangle(frame, (x, y), (x + w_rect, y + h_rect), (0, 255, 0), 2) # Green boxes
 # Draw stable IR grid points
 for x, y, w_rect, h_rect in stable_ir_positions:
 cv2.rectangle(frame, (x, y), (x + w_rect, y + h_rect), (255, 0, 0), 2) # Blue boxes
 # Process frame for hand detection
 frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
 results = hands.process(frame_rgb)
 if results.multi_hand_landmarks:
 for hand_landmarks in results.multi_hand_landmarks:
 # Extract fingertip coordinates (landmark ID 8 for index finger)
 fingertip_x = int(hand_landmarks.landmark[8].x * w)
 fingertip_y = int(hand_landmarks.landmark[8].y * h)
 # Check if fingertip is within any button bounds
 for i, (x, y, w_rect, h_rect) in enumerate(stable_positions):
 if x < fingertip_x < x + w_rect and y < fingertip_y < y + h_rect:
 print(f"Button {i+1} Clicked")
 cv2.putText(frame, f"Button {i+1} Clicked!", (x, y - 10),
 cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
 # Draw hand landmarks (ensuring visibility even near buttons)
 mp_draw.draw_landmarks(frame, hand_landmarks,
mp_hands.HAND_CONNECTIONS)
 # Display the frame
 cv2.imshow("Frame", frame)
 # Break loop on 'q' key press
 if cv2.waitKey(1) & 0xFF == ord('q'):
 break
cap.release()
cv2.destroyAllWindows()
