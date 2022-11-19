import React from "../core/rct/Rct";
import ApiService, { IApiService } from "../core/apiService";

const Preloader = ({ onLoad }: { onLoad: (isSetsDefault: boolean) => void }) => {
  const apiService: IApiService = new ApiService();

  apiService.getCustomFromServer()
    .then(() => {
      onLoad(false);
    })
    .catch(() => {
      onLoad(true);
    });

  return (
    <div id="preloader" className="preloader"  style={{display: 'block',height: '300px',width: '400px',borderRadius: '2.2px', margin: 'auto'}}>
      <br />
      <br />
      <br />
      <br />
      <h1  style={{display: 'block', textAlign: 'center'}}>Loading...</h1>
      <br /><br />
      <div style={{margin: 'auto', display: 'block',height: '5px',width: '110px', border: '1px solid #aaa',borderRadius: '2.2px'}}>
        <div style={{display: 'block',height: '5px',width: '100px',background: '#aaa',borderRadius: '2.2px'}}></div>
      </div>
      <br /><br />
    </div>
  );
}

export default Preloader;
