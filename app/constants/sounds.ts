// Sound related constants

// Sound Types
export enum SoundType {
  ALARM = "alarm",
  TICKING = "ticking",
}

// Alarm sound types
export enum AlarmSoundType {
  BELL = "bell",
  DIGITAL = "digital",
  KITCHEN = "kitchen",
  ANALOG = "analog",
  WOOD = "wood",
}

// Ticking sound types
export enum TickingSoundType {
  NONE = "none",
  TICK1 = "tick1",
  TICK2 = "tick2",
}

// Default sound settings
export const DEFAULT_SOUND_SETTINGS = {
  alarmSound: AlarmSoundType.BELL,
  alarmVolume: 0.7,
  tickingSound: TickingSoundType.NONE,
  tickingVolume: 0.5,
  repeatCount: 1,
};
