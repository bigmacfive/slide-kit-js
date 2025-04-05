export class Plugins {
  constructor(presentation, plugins = []) {
    this.presentation = presentation;
    this.registeredPlugins = new Map();
    
    // 플러그인 등록
    if (plugins && plugins.length > 0) {
      plugins.forEach(plugin => this.register(plugin));
    }
  }
  
  // 플러그인 등록
  register(plugin) {
    if (!plugin || typeof plugin !== 'object') {
      console.error('유효하지 않은 플러그인:', plugin);
      return this;
    }
    
    if (!plugin.name) {
      console.error('플러그인에 이름이 없습니다:', plugin);
      return this;
    }
    
    if (this.registeredPlugins.has(plugin.name)) {
      console.warn(`"${plugin.name}" 플러그인이 이미 등록되어 있습니다.`);
      return this;
    }
    
    // 플러그인 초기화
    if (typeof plugin.init === 'function') {
      try {
        plugin.init(this.presentation);
      } catch (error) {
        console.error(`"${plugin.name}" 플러그인 초기화 오류:`, error);
        return this;
      }
    }
    
    // 플러그인 등록
    this.registeredPlugins.set(plugin.name, plugin);
    
    console.log(`"${plugin.name}" 플러그인이 등록되었습니다.`);
    return this;
  }
  
  // 등록된 플러그인 가져오기
  get(name) {
    return this.registeredPlugins.get(name) || null;
  }
  
  // 플러그인 제거
  unregister(name) {
    const plugin = this.registeredPlugins.get(name);
    
    if (!plugin) {
      console.warn(`"${name}" 플러그인이 등록되어 있지 않습니다.`);
      return this;
    }
    
    // 플러그인 정리 메서드 실행
    if (typeof plugin.destroy === 'function') {
      try {
        plugin.destroy(this.presentation);
      } catch (error) {
        console.error(`"${name}" 플러그인 정리 중 오류:`, error);
      }
    }
    
    // 등록 해제
    this.registeredPlugins.delete(name);
    
    console.log(`"${name}" 플러그인이 제거되었습니다.`);
    return this;
  }
  
  // 모든 플러그인 제거
  unregisterAll() {
    const pluginNames = Array.from(this.registeredPlugins.keys());
    
    pluginNames.forEach(name => {
      this.unregister(name);
    });
    
    return this;
  }
  
  // 이벤트 발행 (모든 플러그인에 이벤트 전파)
  emit(eventName, data) {
    for (const plugin of this.registeredPlugins.values()) {
      if (typeof plugin.handleEvent === 'function') {
        try {
          plugin.handleEvent(eventName, data, this.presentation);
        } catch (error) {
          console.error(`"${plugin.name}" 플러그인 이벤트 처리 중 오류:`, error);
        }
      }
    }
    
    return this;
  }
  
  // 플러그인 생성을 위한 헬퍼 메서드
  static createPlugin(options) {
    const { name, init, destroy, handleEvent } = options;
    
    if (!name) {
      throw new Error('플러그인 이름은 필수입니다.');
    }
    
    return {
      name,
      init: init || (() => {}),
      destroy: destroy || (() => {}),
      handleEvent: handleEvent || (() => {}),
      ...options
    };
  }
} 