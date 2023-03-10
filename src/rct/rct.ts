/**
 *  ╭───────────────────────────────────────────────────────────────────────╮
 *  │       R E A C T  F O R   L A N I A K E A  P R O J E C T               │
 *  │      (Laniakia is Animation/Preseentation/Site Contetnt builder)      │
 *  │                                                                       │
 *  │  @link:                                                               |
 *  |   https://itnext.io/creating-our-own-react-from-scratch-82dd6356676d  │
 *  │                                                                       │
 *  │  Copyright (c) S.Adamovich 2017-2023                                  │
 *  │  License: GNU General Public License v2 or later                      │
 *  │  License URI: http://www.gnu.org/licenses/gpl-2.0.html                │
 *  │  Version: 0.0.0 (10-JUL-2022 - 2023)                                  │
 *  ╰───────────────────────────────────────────────────────────────────────╯
 */

import { Component } from "./core/classComponent";
import { useEffect } from "./core/hooks/useEffect";
import { useRef } from "./core/hooks/useRef";
import { useState } from "./core/hooks/useState";
import { Element } from "./core/Interfaces";
import {
  REACT_COMPONENT,
  REACT_ELEMENT,
  REACT_FRAGMENT,
} from "./core/definitions";
import { isFunctionNative } from "./core/validation/validation";
import { getChildren } from "./core/getChildren";

const React = {
  Component,

  createElement: (
    type?: any,
    properties?: any,
    ...child: any
  ): Element | null => {
    if (isFunctionNative(type)) {
      return null;
    }

    const { key = null, ref = null, ...props } = properties || {};

    if (child.length) {
      props.children = getChildren(child);
    }

    let elTypeof: symbol;

    if (type) {
      elTypeof = typeof type === "function" ? REACT_COMPONENT : REACT_ELEMENT;
    } else {
      elTypeof = REACT_FRAGMENT;
    }

    return { $$typeof: elTypeof, key, ref, _owner: {}, type, props };
  },
};

export { Component, useState, useRef, useEffect };
export default React;
