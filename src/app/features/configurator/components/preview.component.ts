// src/app/features/configurator/components/preview.component.ts - 重构版本 v3.3.0
import { ChangeDetectionStrategy, Component, input, effect, ElementRef, ViewChild, AfterViewInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DecimalPipe, CurrencyPipe } from '@angular/common';
import { TPipe } from '../../../core/services/i18n.service';
import * as THREE from 'three';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-preview',
  imports: [DecimalPipe, CurrencyPipe, TPipe],
  template: `
  <section class="flex-1 relative flex flex-col bg-[#0f0f11]" id="preview-section">
    <div class="absolute top-10 left-10 z-10 pointer-events-none">
      <h1 class="text-4xl font-light text-white tracking-tight">{{ name() }}</h1>
      <p class="text-zinc-500 font-serif italic mt-1">{{ 'preview.v_custom' | t }}</p>
    </div>
    
    <!-- Interactive Canvas Placeholder -->
    <div class="flex-1 w-full h-full relative" id="canvas-container">
      <div #rendererContainer class="absolute inset-0 cursor-move"></div>
    </div>

    <!-- Quick Stats Footer -->
    <div class="h-24 border-t border-zinc-800 flex items-center px-4 md:px-12 gap-6 md:gap-12 bg-[#0a0a0b]/80 backdrop-blur-md overflow-x-auto z-10" id="stats-container">
      <div class="flex-shrink-0">
        <div class="text-[10px] uppercase text-zinc-500 tracking-widest mb-1">{{ 'preview.est_weight' | t }}</div>
        <div class="text-2xl font-light text-white">{{ weight() | number:'1.2-2' }} <span class="text-xs text-zinc-500">kg</span></div>
      </div>
      <div class="w-px h-10 bg-zinc-800 flex-shrink-0"></div>
      <div class="flex-shrink-0">
        <div class="text-[10px] uppercase text-zinc-500 tracking-widest mb-1">{{ 'preview.aero_drag' | t }}</div>
        <div class="text-2xl font-light text-white">{{ cost() > 5000 ? '-14.2' : '-8.5' }} <span class="text-xs text-zinc-500">watts</span></div>
      </div>
      <div class="w-px h-10 bg-zinc-800 flex-shrink-0"></div>
      <div class="flex-shrink-0">
        <div class="text-[10px] uppercase text-zinc-500 tracking-widest mb-1">{{ 'preview.total_cost' | t }}</div>
        <div class="text-2xl font-light text-amber-500">{{ cost() | currency:'USD':'symbol':'1.0-0' }} <span class="text-xs text-zinc-500">USD</span></div>
      </div>
    </div>
  </section>
  `
})
export class PreviewComponent implements AfterViewInit, OnDestroy {
  name = input<string>('S-Works Tarmac SL8');
  type = input<string>('Road');
  weight = input<number>(6.8);
  cost = input<number>(12000);

  @ViewChild('rendererContainer') rendererContainer!: ElementRef<HTMLDivElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private bikeGroup!: THREE.Group;
  private animationId = 0;

  private platformId = inject(PLATFORM_ID);

  constructor() {
    effect(() => {
      const currentType = this.type();
      if (isPlatformBrowser(this.platformId) && this.bikeGroup) {
        this.buildBikeMesh(currentType);
      }
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initThree();
      this.buildBikeMesh(this.type());
      this.animate();
      window.addEventListener('resize', this.onResize.bind(this));
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      cancelAnimationFrame(this.animationId);
      window.removeEventListener('resize', this.onResize.bind(this));
      if (this.renderer && this.rendererContainer) {
        this.renderer.dispose();
        this.rendererContainer.nativeElement.removeChild(this.renderer.domElement);
      }
    }
  }

  private initThree() {
    const el = this.rendererContainer.nativeElement;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    
    this.camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.1, 100);
    this.camera.position.set(2, 1, 3);
    this.camera.lookAt(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 5, 2);
    this.scene.add(directionalLight);

    this.bikeGroup = new THREE.Group();
    this.scene.add(this.bikeGroup);
  }

  private buildBikeMesh(bikeType: string) {
    while(this.bikeGroup.children.length > 0) { 
        this.bikeGroup.remove(this.bikeGroup.children[0]); 
    }

    const matFrame = new THREE.MeshStandardMaterial({ 
      color: bikeType === 'Road' ? 0xcc0000 : (bikeType === 'MTB' ? 0x334433 : 0xaaaaaa),
      roughness: 0.2, metalness: 0.8 
    });
    const matTire = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    const matMetal = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.1 });

    const createCylinder = (radius: number, length: number, mat: THREE.Material) => {
      const geo = new THREE.CylinderGeometry(radius, radius, length, 16);
      const mesh = new THREE.Mesh(geo, mat);
      return mesh;
    };

    const tireRadius = bikeType === 'Fold' ? 0.2 : 0.4;
    const tireThick = bikeType === 'MTB' ? 0.05 : 0.02;
    const geoTire = new THREE.TorusGeometry(tireRadius, tireThick, 16, 64);
    
    const wheel1 = new THREE.Mesh(geoTire, matTire);
    wheel1.position.set(-0.6, -0.2, 0);
    
    const wheel2 = new THREE.Mesh(geoTire, matTire);
    wheel2.position.set(0.6, -0.2, 0);

    const topTube = createCylinder(0.02, 0.7, matFrame);
    topTube.position.set(0, 0.3, 0);
    topTube.rotation.z = Math.PI / 2;

    const downTube = createCylinder(0.025, 0.8, matFrame);
    downTube.position.set(-0.1, 0.05, 0);
    downTube.rotation.z = -Math.PI / 4;

    const seatTube = createCylinder(0.02, 0.7, matFrame);
    seatTube.position.set(-0.35, 0.1, 0);
    seatTube.rotation.z = Math.PI / 8;

    const chainStay = createCylinder(0.015, 0.5, matFrame);
    chainStay.position.set(-0.45, -0.2, 0);
    chainStay.rotation.z = Math.PI / 2;

    const seatStay = createCylinder(0.015, 0.55, matFrame);
    seatStay.position.set(-0.5, 0.05, 0);
    seatStay.rotation.z = -Math.PI / 3;

    const fork = createCylinder(0.015, 0.6, matFrame);
    fork.position.set(0.5, 0.05, 0);
    fork.rotation.z = Math.PI / 8;

    const handlebars = createCylinder(0.015, 0.4, matMetal);
    handlebars.position.set(0.4, 0.4, 0);
    handlebars.rotation.x = Math.PI / 2;

    if (bikeType === 'MTB') {
        handlebars.scale.set(1, 1.5, 1);
        downTube.scale.set(1.5, 1, 1.5);
    } else if (bikeType === 'Fold') {
        seatTube.scale.set(1, 1.5, 1);
        fork.scale.set(1, 0.8, 1);
        topTube.rotation.z = -Math.PI / 2 + 0.2;
    }

    this.bikeGroup.add(wheel1, wheel2, topTube, downTube, seatTube, chainStay, seatStay, fork, handlebars);
  }

  private animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    if (this.bikeGroup) {
      this.bikeGroup.rotation.y += 0.005;
    }
    
    this.renderer.render(this.scene, this.camera);
  }

  private onResize() {
    if (!this.rendererContainer) return;
    const el = this.rendererContainer.nativeElement;
    this.camera.aspect = el.clientWidth / el.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(el.clientWidth, el.clientHeight);
  }
}
