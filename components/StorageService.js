class StorageService {
  static getProperties(defaultProperties) {
    const saved = localStorage.getItem("properties");

    if (saved) {
      return JSON.parse(saved);
    }
    return defaultProperties;
  }

  static getProperty(id) {
    const current = this.getProperties([]);
    return current.find((p) => Number(p.id) === Number(id));
  }

  static saveProperties(properties) {
    localStorage.setItem("properties", JSON.stringify(properties));
  }

  static addProperty(newProperty) {
    const current = this.getProperties([]);
    current.push(newProperty);
    this.saveProperties(current);
  }

  static deleteProperty(id) {
    const current = this.getProperties([]);
    if (current.length === 1) {
      localStorage.removeItem("properties");
      location.reload();
      return;
    } else {
      const updated = current.filter((p) => Number(p.id) !== Number(id));
      this.saveProperties(updated);
    }
  }

  static getNextId() {
    const properties = this.getProperties([]);
    if (properties.length === 0) return 1;

    const maxId = Math.max(...properties.map((p) => Number(p.id)));
    return maxId + 1;
  }

  static getMaxId() {
    const properties = this.getProperties([]);
    if (properties.length !== 0) {
      const maxId = Math.max(...properties.map((p) => Number(p.id)));
      return maxId;
    } else {
      alert("No hay propiedades registradas!");
      return 0;
    }
  }

  static getMaxPublishedId() {
    const published = localStorage.getItem("publishedMaxId");
    return published ? Number(published) : 0;
  }

  static setMaxPublishedId(id) {
    localStorage.setItem("publishedMaxId", Number(id));
  }
}

export default StorageService;
