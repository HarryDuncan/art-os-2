from cvzone.SelfiSegmentationModule import SelfiSegmentation

# Initialize the SelfiSegmentation module once
segmentor = SelfiSegmentation()

def segment_frame(frame, background_color=(0, 0, 0), threshold=0.9):
    """
    Segments the given frame using the initialized SelfiSegmentation object.

    Args:
        frame: The input video frame (numpy array).
        background_color: Tuple representing the RGB color for the background.
        threshold: The confidence threshold for background removal.

    Returns:
        The segmented image with the background replaced.
    """
    # Use the segmentor to remove the background
    segmented_img = segmentor.removeBG(frame, background_color, threshold)
    return segmented_img
