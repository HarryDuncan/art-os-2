export enum INTERACTION_ALGORITHIMS {
  BODY_PIX = "BODY_PIX",
  POSENET = "POSENET",
}

export const KEYPOINT = {
  NOSE: 0,
  LEFT_EYE: 1,
  RIGHT_EYE: 2,
  LEFT_EAR: 3,
  RIGHT_EAR: 4,
  LEFT_SHOULDER: 5,
  RIGHT_SHOULDER: 6,
  LEFT_ELBOW: 7,
  RIGHT_ELBOW: 8,
  LEFT_WRIST: 9,
  RIGHT_WRIST: 10,
  LEFT_HIP: 11,
  RIGHT_HIP: 12,
  LEFT_KNEE: 13,
  RIGHT_KNEE: 14,
  LEFT_ANKLE: 15,
  RIGHT_ANKLE: 16,
};

export const POSENET_DEFAULT_ALGORITHM = {
  algorithm_type: "POSENET",
  algorithm_config: {
    threshold: 0.55,
    keypoints: [KEYPOINT.LEFT_WRIST],
  },
  data_transform_type: "keypoint-positions",
  id: "algo",
};

export const BODY_PIX_DEFAULT_ALGORITHM = {
  algorithm_type: "BODYPIX",
  algorithm_config: {},
};
