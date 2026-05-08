// src/app/core/models/types.ts - 重构版本 v3.3.0
import { Timestamp } from 'firebase/firestore';

/**
 * 自行车配置中的单个组件
 * @interface ConfigComponent
 */
export interface ConfigComponent {
  /** 组件的唯一标识符 */
  id: string;

  /** 组件类别（如 'Drivetrain', 'Wheelset', 'Frame'） */
  category: ComponentCategory;

  /** 组件的显示名称 */
  name: string;

  /** 价格（美元） */
  price: number;

  /** 重量（克） */
  weight: number;

  /** 组件兼容的自行车类型（可选） */
  bikeType?: BikeType;

  /** 可选的规格或详细描述 */
  specs?: string;

  /** 可选的品牌名称 */
  brand?: string;

  /** 可选的型号名称 */
  model?: string;
}

/**
 * 可保存/加载的完整自行车配置
 * @interface Configuration
 */
export interface Configuration {
  /** 配置的唯一标识符（保存时自动生成） */
  id?: string;

  /** 配置所有者的 Firebase 用户 ID */
  userId?: string;

  /** 配置适用的自行车类型 */
  bikeType: BikeType;

  /** 配置的显示名称 */
  name: string;

  /** 组成此配置的组件数组 */
  components: ConfigComponent[];

  /** 所有组件的总成本（美元） */
  totalCost: number;

  /** 整车预估重量（千克） */
  estimatedWeight: number;

  /** 配置创建时的服务器时间戳 */
  createdAt?: Timestamp;

  /** 配置最后更新时的服务器时间戳 */
  updatedAt?: Timestamp;
}

/**
 * 自行车类型
 * @type {string}
 */
export type BikeType = 'Road' | 'MTB' | 'Fold';

/**
 * 组件类别
 * @type {string}
 */
export type ComponentCategory = 'Frame' | 'Drivetrain' | 'Wheelset' | 'Suspension' | 'Cockpit' | 'Tires';

/**
 * 状态管理配置状态接口
 * @interface ConfigState
 */
export interface ConfigState {
  /** 当前激活的自行车类型 */
  activeType: BikeType;

  /** 当前配置中的组件数组 */
  components: ConfigComponent[];

  /** 当前配置 ID（未保存则为 null） */
  configId: string | null;

  /** 手动配置名称（使用默认则为 null） */
  manualConfigName: string | null;

  /** 数据库中所有可用的组件 */
  allDbComponents: ConfigComponent[];

  /** 方案库模态框是否可见 */
  showLibrary: boolean;

  /** 用户保存的配置 */
  myConfigs: Configuration[];

  /** 用户是否已登录 */
  isLoggedIn: boolean;

  /** 配置是否正在保存 */
  isSaving: boolean;

  /** 组件选择器模态框是否可见 */
  showComponentSelector: boolean;

  /** 正在编辑的组件 ID */
  editingComponentId: string;
}

/**
 * 不同自行车类型的默认组件配置
 * @interface DefaultComponents
 */
export interface DefaultComponents {
  Road: ConfigComponent[];
  MTB: ConfigComponent[];
  Fold: ConfigComponent[];
}

/**
 * Firebase 配置接口
 * @interface FirebaseConfig
 */
export interface FirebaseConfig {
  projectId: string;
  appId: string;
  apiKey: string;
  authDomain: string;
  firestoreDatabaseId: string;
  storageBucket: string;
  messagingSenderId: string;
  measurementId?: string;
}

/**
 * Firebase 错误处理的操作类型
 * @enum {string}
 */
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

/**
 * Firestore 错误信息结构
 * @interface FirestoreErrorInfo
 */
export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: Record<string, unknown>;
}
