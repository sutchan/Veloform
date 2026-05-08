// src/app/core/constants/app.constants.ts - 重构版本 v3.3.0
import { ConfigComponent } from '../models/types';

/**
 * 默认公路车组件配置
 * 当数据库中没有可用组件时使用
 */
export const ROAD_DEFAULTS: ConfigComponent[] = [
  { id: '1', category: 'Drivetrain', name: 'Shimano Dura-Ace Di2 R9200', price: 4200, weight: 2430 },
  { id: '2', category: 'Wheelset', name: 'Roval Rapide CLX II', price: 2800, weight: 1520 },
  { id: '3', category: 'Cockpit', name: 'Roval Rapide Cockpit', price: 600, weight: 310 },
  { id: '4', category: 'Tires', name: 'Turbo Cotton 28mm', price: 180, weight: 480 },
];

/**
 * 默认山地车组件配置
 * 当数据库中没有可用组件时使用
 */
export const MTB_DEFAULTS: ConfigComponent[] = [
  { id: '5', category: 'Drivetrain', name: 'SRAM XX1 Eagle AXS', price: 2500, weight: 1515 },
  { id: '6', category: 'Suspension', name: 'Fox 34 Float Factory', price: 1050, weight: 1738 },
  { id: '7', category: 'Wheelset', name: 'Reserve 30|SL', price: 1800, weight: 1650 },
  { id: '8', category: 'Tires', name: 'Maxxis Rekon 2.4', price: 160, weight: 1600 },
];

/**
 * 默认折叠车组件配置
 * 当数据库中没有可用组件时使用
 */
export const FOLD_DEFAULTS: ConfigComponent[] = [
  { id: '9', category: 'Drivetrain', name: 'Brompton 6-Speed', price: 400, weight: 1200 },
  { id: '10', category: 'Frame', name: 'Titanium Main Frame', price: 2100, weight: 1800 },
  { id: '11', category: 'Wheelset', name: 'Brompton Superlight', price: 800, weight: 1100 },
];

/**
 * 应用常量配置
 */
export const APP_CONSTANTS = {
  /** 自行车类型 */
  BIKE_TYPES: ['Road', 'MTB', 'Fold'] as const,

  /** 组件类别 */
  COMPONENT_CATEGORIES: ['Frame', 'Drivetrain', 'Wheelset', 'Suspension', 'Cockpit', 'Tires'] as const,

  /** 默认基础重量（克） */
  BASE_WEIGHTS: {
    Road: 900,
    MTB: 1800,
    Fold: 2000,
  } as const,

  /** 重量转换系数（克转千克） */
  WEIGHT_CONVERSION_FACTOR: 1000,

  /** Firestore 集合名称 */
  FIRESTORE_COLLECTIONS: {
    configurations: 'configurations',
    components: 'components',
  } as const,

  /** 应用元数据 */
  APP_INFO: {
    name: 'Veloform',
    version: '3.3.0',
    tagline: 'Bike Configurator',
  } as const,
} as const;

/**
 * 获取指定类型的默认组件
 * @param type - 自行车类型
 * @returns 对应类型的默认组件数组
 */
export function getDefaultsForType(type: 'Road' | 'MTB' | 'Fold'): ConfigComponent[] {
  switch (type) {
    case 'Road':
      return [...ROAD_DEFAULTS];
    case 'MTB':
      return [...MTB_DEFAULTS];
    case 'Fold':
      return [...FOLD_DEFAULTS];
  }
}
