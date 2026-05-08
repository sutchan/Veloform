// src/app/core/services/component.repository.ts - 重构版本 v3.3.0
import { getFirestore, collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { ConfigComponent } from '../models/types';
import { firebaseService } from './firebase.service';
import { notificationService } from './notification.service';
import { APP_CONSTANTS } from '../constants/app.constants';

/**
 * 组件数据访问层
 * 负责处理与组件相关的所有数据库操作
 */
class ComponentRepository {
  private db = getFirestore(firebaseService.app, firebaseService.config.firestoreDatabaseId);

  /**
   * 获取所有组件
   * @returns Promise<ConfigComponent[]> 组件数组
   */
  async getAll(): Promise<ConfigComponent[]> {
    try {
      const snap = await getDocs(collection(this.db, APP_CONSTANTS.FIRESTORE_COLLECTIONS.components));
      
      if (snap.empty) {
        await this.seedComponents();
        const freshSnap = await getDocs(collection(this.db, APP_CONSTANTS.FIRESTORE_COLLECTIONS.components));
        return freshSnap.docs.map(d => d.data() as ConfigComponent);
      }
      
      return snap.docs.map(d => d.data() as ConfigComponent);
    } catch (error) {
      console.error('Failed to fetch components:', error);
      notificationService.error('Failed to load components. Please refresh the page.');
      return [];
    }
  }

  /**
   * 初始化组件种子数据
   * @private
   */
  private async seedComponents() {
    const seeds: ConfigComponent[] = [
      { id: 'frame_road_sl8', category: 'Frame', bikeType: 'Road', name: 'S-Works Tarmac SL8', price: 5500, weight: 850, specs: 'Carbon Fact 12r' },
      { id: 'frame_road_aethos', category: 'Frame', bikeType: 'Road', name: 'Aethos Pro', price: 4200, weight: 685, specs: 'Carbon Fact 10r' },
      { id: 'drive_road_da', category: 'Drivetrain', bikeType: 'Road', name: 'Shimano Dura-Ace Di2 R9200', price: 4200, weight: 2430, specs: '12-speed electronic' },
      { id: 'wheel_road_clx', category: 'Wheelset', bikeType: 'Road', name: 'Roval Rapide CLX II', price: 2800, weight: 1520, specs: 'Aero Carbon' },
      
      { id: 'frame_mtb_epic', category: 'Frame', bikeType: 'MTB', name: 'Epic World Cup', price: 3500, weight: 1750, specs: 'Carbon, 75mm travel' },
      { id: 'drive_mtb_xx1', category: 'Drivetrain', bikeType: 'MTB', name: 'SRAM XX1 Eagle AXS', price: 2500, weight: 1515, specs: '12-speed wireless' },
      { id: 'susp_mtb_fox34', category: 'Suspension', bikeType: 'MTB', name: 'Fox 34 Float Factory', price: 1050, weight: 1738, specs: '120mm travel' },
      { id: 'wheel_mtb_res30', category: 'Wheelset', bikeType: 'MTB', name: 'Reserve 30|SL', price: 1800, weight: 1650, specs: 'Carbon MTB' },
      
      { id: 'frame_fold_tline', category: 'Frame', bikeType: 'Fold', name: 'Brompton T Line Titanium', price: 2100, weight: 1800, specs: 'Titanium' },
      { id: 'drive_fold_6spd', category: 'Drivetrain', bikeType: 'Fold', name: 'Brompton 6-Speed', price: 400, weight: 1200, specs: 'Internal hub' },
      { id: 'wheel_fold_super', category: 'Wheelset', bikeType: 'Fold', name: 'Brompton Superlight', price: 800, weight: 1100, specs: '16 inch' }
    ];

    for (const seed of seeds) {
      try {
        await setDoc(
          doc(collection(this.db, APP_CONSTANTS.FIRESTORE_COLLECTIONS.components), seed.id),
          seed
        );
      } catch (error) {
        console.error(`Failed to seed component ${seed.id}:`, error);
      }
    }
  }
}

/**
 * 组件 Repository 单例
 */
export const componentRepository = new ComponentRepository();

/**
 * 获取所有组件（便捷函数）
 */
export async function getComponentsFromDB(): Promise<ConfigComponent[]> {
  return componentRepository.getAll();
}
