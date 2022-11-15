import React, { useState } from 'react';
import ID from '../../core/id';
import Model from '../../models/model';
import JComponent from './JComponent';

type IJFab = {
  crName?: string;
  route?: string; // exmpl: 'mainSlug_mainSlug_content_containerSlug'.
  type? : string; // is a container type (menu, image, collectionPosition...) see WPTheme->preloader.php->asvComponents_get_jData() -> "type"
}

const JFab = ({ crName, route, type: JFabType }: IJFab) => {
  const j = Model.ob().container.getCrsJSN(route, Model.ob().jData);

  const ins = Object
    .keys(j)
    .map((c: any) => {
      const {title, type, subType, subCr, hint, cntnr, m} = j[c.content || c];

      if (type === 'menu' && crName) {
        const attrs = { crName, route: `${route}_${c}_content` };
        return <JFabMenu key={`key_${ID.new()}`} title={title} attrs={attrs} />;
      }

      /* Component | Collection see log(type, route) */
      if (type && crName) {
        return <JComponent key={`key_${ID.new()}`} {...{ container: type, crName, subCr, title: hint,
                data: { type: JFabType || cntnr, subType, m }}} />;
      }
      return null;
    });

  return (
    <>
      {ins}
    </>
  );
}

type JFabMenuT = {title: string, attrs: {crName: string, route: string}};

const JFabMenu = ({title, attrs: {crName, route}}: JFabMenuT) => {
  const [jFabMenu, setJFabMenu] = useState(false);

  const jFabSubmenu = jFabMenu ? <JFab crName={crName} route={route} /> : null;

  const onJFabMenuClick = () => setJFabMenu(jFabMenu ? false : true);

  let style;
  if (title.length > 8) {
    style = { fontSize: '9px' };
  }
  if (title.length > 9) {
    style = { fontSize: '8px' };
  }

  return (
    <div style={style} className="fab-menu toggle-title">
      <span onClick={onJFabMenuClick}>{title}</span>
      {jFabSubmenu}
    </div>
  );
}

export default JFab;
