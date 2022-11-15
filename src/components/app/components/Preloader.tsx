import React from "react";

import ApiService, { IApiService } from "../../../services/apiService";
import Model from "../../../models/model";

const Preloader = (props: { onLoad: (isSetsDefault: boolean) => void }) => {
  const { onLoad } = props;

  const apiService: IApiService = new ApiService();

  apiService.getCustomFromServer()
    .then(() => {
      Model.ob();
      onLoad(false);
    })
    .catch(() => {
      Model.ob();
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
