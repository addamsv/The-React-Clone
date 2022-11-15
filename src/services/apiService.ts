import common from '../sets/common.json';

interface IApiService {
  getCustomFromServer(): Promise<Array<any> | undefined>; // Promise<Array<ISection> | undefined>;
}

class ApiService implements IApiService {
  private url = common.serverURL;

  getCustomFromServer = async (): Promise<Array<any> | undefined> => {
    return fetch(this.url).then((res) => res.ok ? res.json() : undefined);
  }
}

export default ApiService;
export { IApiService };
