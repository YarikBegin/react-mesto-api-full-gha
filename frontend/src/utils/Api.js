class Api {
  constructor(options) {
    this._url = options.url;
  }
  _checkResult(res) {
    return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
  }
  _fetch(path, method, data) {
    let body = data;
    if((method === 'PATCH' || method === 'POST') && data) {
      body = JSON.stringify(data);
    }

    return fetch(this._url + path, {
      method,
      headers: {
        authorization: `Bearer ${localStorage.getItem('JWT')}`,
        'Content-Type': 'application/json',
      },
      body,
    }).then(this._checkResult);
  }
  getUserInform() {
    return this._fetch(`/users/me`, 'GET');
  }
  getInitialCards() {
    return this._fetch('/cards', 'GET');
  }
  setUserInfo(data) {
    return this._fetch('/users/me', 'PATCH', data);
  }
  addNewCard(data) {
    return this._fetch('/cards', 'POST', data);
  }
  deleteCard(id) {
    return this._fetch(`/cards/${id}`, 'DELETE');
  }
  likeCard(id) {
    return this._fetch(`/cards/likes/${id}`, 'PUT');
  }
  dislikeCard(id) {
    return this._fetch(`/cards/likes/${id}`, 'DELETE');
  }
  changeLikeCardStatus(id, hasLike) {
    if (!hasLike) {
      return api.likeCard(id);
    }
    return api.dislikeCard(id);
  }
  setUserAvatar(data) {
    return this._fetch(`/users/me/avatar`, 'PATCH', data);
  }
  getAllData() {
    return Promise.all([this.getUserInform(), this.getInitialCards()]);
  }
}

export const api = new Api({
  url: `https://api.begin.nomoredomains.work`,
});
