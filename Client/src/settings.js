// DEBUG mode
export const DEBUG = false;

// Application name
export const NAME = 'HIV Platform';

// Application version
export const VERSION = '1.9.15';

// Duration of the notification displayed at the bottom of the screen [in milliseconds]
export const NOTIFICATION_DURATION = 5000;

// List of stages
export const STAGES = [
  'START',
  'SESSION_INITIALIZED',
  'CASE_BASED_UPLOAD',
  'CASE_BASED_ATTR_MAPPING',
  'CASE_BASED_ORIGIN_GROUPING',
  'CASE_BASED_SUMMARY',
  'CASE_BASED_ADJUSTMENTS',
  'MODELLING',
  'BOOTSTRAP'
];

// Lists of stages enabled conditional on previously completed stages
export const EVENT_TO_ENABLED_STAGES_MAP = {
  START: ['SESSION_INITIALIZED'],
  SESSION_INITIALIZED: ['SESSION_INITIALIZED', 'CASE_BASED_UPLOAD'],
  CASE_BASED_DATA_UPLOADED: ['SESSION_INITIALIZED', 'CASE_BASED_UPLOAD'],
  CASE_BASED_DATA_READ: ['SESSION_INITIALIZED', 'CASE_BASED_UPLOAD', 'CASE_BASED_ATTR_MAPPING'],
  AGGR_DATA_UPLOADED: ['SESSION_INITIALIZED', 'CASE_BASED_UPLOAD', 'CASE_BASED_ATTR_MAPPING'],
  AGGR_DATA_READ: ['SESSION_INITIALIZED', 'CASE_BASED_UPLOAD', 'CASE_BASED_ATTR_MAPPING', 'CASE_BASED_ORIGIN_GROUPING', 'CASE_BASED_SUMMARY', 'CASE_BASED_ADJUSTMENTS', 'MODELLING', 'BOOTSTRAP'],
  CASE_BASED_ATTRIBUTE_MAPPING_APPLY_START: ['SESSION_INITIALIZED', 'CASE_BASED_UPLOAD', 'CASE_BASED_ATTR_MAPPING'],
  CASE_BASED_ATTRIBUTE_MAPPING_APPLY_END: ['SESSION_INITIALIZED', 'CASE_BASED_UPLOAD', 'CASE_BASED_ATTR_MAPPING', 'CASE_BASED_ORIGIN_GROUPING'],
  CASE_BASED_DATA_PREPROCESSED: ['SESSION_INITIALIZED', 'CASE_BASED_UPLOAD', 'CASE_BASED_ATTR_MAPPING', 'CASE_BASED_ORIGIN_GROUPING'],
  CASE_BASED_DATA_ORIGIN_DISTR_COMPUTED: ['SESSION_INITIALIZED', 'CASE_BASED_UPLOAD', 'CASE_BASED_ATTR_MAPPING', 'CASE_BASED_ORIGIN_GROUPING'],
  CASE_BASED_DATA_ORIGIN_GROUPING_SET: ['SESSION_INITIALIZED', 'CASE_BASED_UPLOAD', 'CASE_BASED_ATTR_MAPPING', 'CASE_BASED_ORIGIN_GROUPING'],
  CASE_BASED_DATA_ORIGIN_GROUPING_APPLIED: ['SESSION_INITIALIZED', 'CASE_BASED_UPLOAD', 'CASE_BASED_ATTR_MAPPING', 'CASE_BASED_ORIGIN_GROUPING', 'CASE_BASED_SUMMARY', 'CASE_BASED_ADJUSTMENTS'],
  SUMMARY_DATA_PREPARED: ['SESSION_INITIALIZED', 'CASE_BASED_UPLOAD', 'CASE_BASED_ATTR_MAPPING', 'CASE_BASED_ORIGIN_GROUPING', 'CASE_BASED_SUMMARY', 'CASE_BASED_ADJUSTMENTS'],
  ADJUSTMENTS_RUN_STARTED: ['SESSION_INITIALIZED', 'CASE_BASED_UPLOAD', 'CASE_BASED_ATTR_MAPPING', 'CASE_BASED_ORIGIN_GROUPING', 'CASE_BASED_SUMMARY', 'CASE_BASED_ADJUSTMENTS'],
  ADJUSTMENTS_RUN_FINISHED: ['SESSION_INITIALIZED', 'CASE_BASED_UPLOAD', 'CASE_BASED_ATTR_MAPPING', 'CASE_BASED_ORIGIN_GROUPING', 'CASE_BASED_SUMMARY', 'CASE_BASED_ADJUSTMENTS', 'MODELLING'],
  ADJUSTMENTS_RUN_LOG_SET: ['SESSION_INITIALIZED', 'CASE_BASED_UPLOAD', 'CASE_BASED_ATTR_MAPPING', 'CASE_BASED_ORIGIN_GROUPING', 'CASE_BASED_SUMMARY', 'CASE_BASED_ADJUSTMENTS', 'MODELLING'],
  MODEL_RUN_STARTED: ['SESSION_INITIALIZED', 'CASE_BASED_UPLOAD', 'CASE_BASED_ATTR_MAPPING', 'CASE_BASED_ORIGIN_GROUPING', 'CASE_BASED_SUMMARY', 'CASE_BASED_ADJUSTMENTS', 'MODELLING'],
  MODEL_RUN_FINISHED: ['SESSION_INITIALIZED', 'CASE_BASED_UPLOAD', 'CASE_BASED_ATTR_MAPPING', 'CASE_BASED_ORIGIN_GROUPING', 'CASE_BASED_SUMMARY', 'CASE_BASED_ADJUSTMENTS', 'MODELLING', 'BOOTSTRAP'],
  BOOTSTRAP_RUN_STARTED: ['SESSION_INITIALIZED', 'CASE_BASED_UPLOAD', 'CASE_BASED_ATTR_MAPPING', 'CASE_BASED_ORIGIN_GROUPING', 'CASE_BASED_SUMMARY', 'CASE_BASED_ADJUSTMENTS', 'MODELLING', 'BOOTSTRAP'],
  BOOTSTRAP_RUN_PROGRESSES: ['SESSION_INITIALIZED', 'CASE_BASED_UPLOAD', 'CASE_BASED_ATTR_MAPPING', 'CASE_BASED_ORIGIN_GROUPING', 'CASE_BASED_SUMMARY', 'CASE_BASED_ADJUSTMENTS', 'MODELLING', 'BOOTSTRAP'],
  BOOTSTRAP_RUN_FINISHED: ['SESSION_INITIALIZED', 'CASE_BASED_UPLOAD', 'CASE_BASED_ATTR_MAPPING', 'CASE_BASED_ORIGIN_GROUPING', 'CASE_BASED_SUMMARY', 'CASE_BASED_ADJUSTMENTS', 'MODELLING', 'BOOTSTRAP']
};
