const forEach = (array, callback, scope) => {
  for (let i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i]);
  }
};

const getRequest = (path, callback) => {
  const request = new XMLHttpRequest();
  request.open('GET', path, true);
  request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
      callback(request.responseText);
    }
  };
  request.send();
};

const defaultOptions = {
  apiBase: 'http://api.mycoolcms.com',
  domQuery: '[data-cms-enable]',
};

class CMS {
  constructor(username, opts = {}) {
    console.log(username, 123);
    this.options = Object.assign({}, defaultOptions, opts);
    this.username = username;
    this.apiUrl = `${this.options.apiBase}/api/v1/${username}/`;
    this.init();
  }

  init() {
    const nodeList = document.querySelectorAll(this.options.domQuery);
    const objects = {};
    forEach(nodeList, (index, element) => {
      const id = element.dataset.cmsId.trim();
      if (objects[id]) {
        console.warn(`Sorry, but you have a duplicate with ID ${id}`);
      } else {
        objects[id] = element;
      }
    });
    const string = Object.keys(objects).sort().join(',');
    this.objects = objects;
    if (string !== '') {
      this.fetch(string);
    }
  }

  fetch(string) {
    const url = this.apiUrl + string;
    getRequest(url, (response) => {
      const json = JSON.parse(response);
      if (json.items) {
        this.parse(json.items);
      }
    });
  }

  parse(items) {
    items.forEach((item) => {
      if (this.objects[item.key]) {
        this.objects[item.key].innerHTML = item.html;
      }
    });
  }
}

window.CMS = CMS;
