import{a as Ne}from"./chunk-M2SJSBYH.js";import{B as Ve,C as We,D as qe,E as Ue,i as Re,p as Be,r as Le,s as z,w as q,y as Qe}from"./chunk-GNDREWZO.js";import{A as W,Ca as je,f as L,k as Te,m as Q,s as Oe,ta as ze,u as Ie,wa as Fe,xa as He,y as Ae,z as V}from"./chunk-HWHB2DAS.js";import{$b as O,Ab as N,B as re,Ba as K,Ca as ge,Cb as b,D as T,Eb as C,Fb as k,Hb as x,I as se,Ib as f,Ic as De,Jb as m,Kb as r,Lb as a,Mb as G,Nb as R,Ob as X,Oc as B,Pb as Ce,Qb as ve,Qc as M,R as Z,Rc as Se,Ub as u,Va as xe,Wb as v,Xb as Y,Yb as w,Za as l,Zb as J,_ as F,_b as we,aa as P,ac as I,ca as d,db as fe,fb as _e,fc as Me,g as E,gc as A,ia as de,ib as ye,ic as s,j as S,ja as le,jc as h,ka as pe,m as oe,mb as _,na as ce,nb as j,ob as y,pc as Ee,qa as g,qb as $,qc as Pe,ra as me,rb as be,rc as ke,ua as ue,vc as D,ya as H,za as he}from"./chunk-7J4QEKOG.js";var ee=new P("CdkAccordion"),Ze=(()=>{class n{_stateChanges=new S;_openCloseAllActions=new S;id=d(z).getId("cdk-accordion-");multi=!1;openAll(){this.multi&&this._openCloseAllActions.next(!0)}closeAll(){this._openCloseAllActions.next(!1)}ngOnChanges(e){this._stateChanges.next(e)}ngOnDestroy(){this._stateChanges.complete(),this._openCloseAllActions.complete()}static \u0275fac=function(t){return new(t||n)};static \u0275dir=y({type:n,selectors:[["cdk-accordion"],["","cdkAccordion",""]],inputs:{multi:[2,"multi","multi",M]},exportAs:["cdkAccordion"],features:[D([{provide:ee,useExisting:n}]),H]})}return n})(),Ke=(()=>{class n{accordion=d(ee,{optional:!0,skipSelf:!0});_changeDetectorRef=d(B);_expansionDispatcher=d(q);_openCloseAllSubscription=E.EMPTY;closed=new g;opened=new g;destroyed=new g;expandedChange=new g;id=d(z).getId("cdk-accordion-child-");get expanded(){return this._expanded}set expanded(e){if(this._expanded!==e){if(this._expanded=e,this.expandedChange.emit(e),e){this.opened.emit();let t=this.accordion?this.accordion.id:this.id;this._expansionDispatcher.notify(this.id,t)}else this.closed.emit();this._changeDetectorRef.markForCheck()}}_expanded=!1;get disabled(){return this._disabled()}set disabled(e){this._disabled.set(e)}_disabled=ue(!1);_removeUniqueSelectionListener=()=>{};constructor(){}ngOnInit(){this._removeUniqueSelectionListener=this._expansionDispatcher.listen((e,t)=>{this.accordion&&!this.accordion.multi&&this.accordion.id===t&&this.id!==e&&(this.expanded=!1)}),this.accordion&&(this._openCloseAllSubscription=this._subscribeToOpenCloseAllActions())}ngOnDestroy(){this.opened.complete(),this.closed.complete(),this.destroyed.emit(),this.destroyed.complete(),this._removeUniqueSelectionListener(),this._openCloseAllSubscription.unsubscribe()}toggle(){this.disabled||(this.expanded=!this.expanded)}close(){this.disabled||(this.expanded=!1)}open(){this.disabled||(this.expanded=!0)}_subscribeToOpenCloseAllActions(){return this.accordion._openCloseAllActions.subscribe(e=>{this.disabled||(this.expanded=e)})}static \u0275fac=function(t){return new(t||n)};static \u0275dir=y({type:n,selectors:[["cdk-accordion-item"],["","cdkAccordionItem",""]],inputs:{expanded:[2,"expanded","expanded",M],disabled:[2,"disabled","disabled",M]},outputs:{closed:"closed",opened:"opened",destroyed:"destroyed",expandedChange:"expandedChange"},exportAs:["cdkAccordionItem"],features:[D([{provide:ee,useValue:void 0}])]})}return n})(),$e=(()=>{class n{static \u0275fac=function(t){return new(t||n)};static \u0275mod=j({type:n});static \u0275inj=F({})}return n})();var on=["body"],rn=["bodyWrapper"],sn=[[["mat-expansion-panel-header"]],"*",[["mat-action-row"]]],dn=["mat-expansion-panel-header","*","mat-action-row"];function ln(n,o){}var pn=[[["mat-panel-title"]],[["mat-panel-description"]],"*"],cn=["mat-panel-title","mat-panel-description","*"];function mn(n,o){n&1&&(R(0,"span",1),pe(),R(1,"svg",2),Ce(2,"path",3),X()())}var te=new P("MAT_ACCORDION"),Ge=new P("MAT_EXPANSION_PANEL"),un=(()=>{class n{_template=d(fe);_expansionPanel=d(Ge,{optional:!0});constructor(){}static \u0275fac=function(t){return new(t||n)};static \u0275dir=y({type:n,selectors:[["ng-template","matExpansionPanelContent",""]]})}return n})(),Xe=new P("MAT_EXPANSION_PANEL_DEFAULT_OPTIONS"),ie=(()=>{class n extends Ke{_viewContainerRef=d(ye);_animationsDisabled=qe();_document=d(ce);_ngZone=d(me);_elementRef=d(K);_renderer=d(_e);_cleanupTransitionEnd;get hideToggle(){return this._hideToggle||this.accordion&&this.accordion.hideToggle}set hideToggle(e){this._hideToggle=e}_hideToggle=!1;get togglePosition(){return this._togglePosition||this.accordion&&this.accordion.togglePosition}set togglePosition(e){this._togglePosition=e}_togglePosition;afterExpand=new g;afterCollapse=new g;_inputChanges=new S;accordion=d(te,{optional:!0,skipSelf:!0});_lazyContent;_body;_bodyWrapper;_portal;_headerId=d(z).getId("mat-expansion-panel-header-");constructor(){super();let e=d(Xe,{optional:!0});this._expansionDispatcher=d(q),e&&(this.hideToggle=e.hideToggle)}_hasSpacing(){return this.accordion?this.expanded&&this.accordion.displayMode==="default":!1}_getExpandedState(){return this.expanded?"expanded":"collapsed"}toggle(){this.expanded=!this.expanded}close(){this.expanded=!1}open(){this.expanded=!0}ngAfterContentInit(){this._lazyContent&&this._lazyContent._expansionPanel===this&&this.opened.pipe(Z(null),T(()=>this.expanded&&!this._portal),se(1)).subscribe(()=>{this._portal=new Qe(this._lazyContent._template,this._viewContainerRef)}),this._setupAnimationEvents()}ngOnChanges(e){this._inputChanges.next(e)}ngOnDestroy(){super.ngOnDestroy(),this._cleanupTransitionEnd?.(),this._inputChanges.complete()}_containsFocus(){if(this._body){let e=this._document.activeElement,t=this._body.nativeElement;return e===t||t.contains(e)}return!1}_transitionEndListener=({target:e,propertyName:t})=>{e===this._bodyWrapper?.nativeElement&&t==="grid-template-rows"&&this._ngZone.run(()=>{this.expanded?this.afterExpand.emit():this.afterCollapse.emit()})};_setupAnimationEvents(){this._ngZone.runOutsideAngular(()=>{this._animationsDisabled?(this.opened.subscribe(()=>this._ngZone.run(()=>this.afterExpand.emit())),this.closed.subscribe(()=>this._ngZone.run(()=>this.afterCollapse.emit()))):setTimeout(()=>{let e=this._elementRef.nativeElement;this._cleanupTransitionEnd=this._renderer.listen(e,"transitionend",this._transitionEndListener),e.classList.add("mat-expansion-panel-animations-enabled")},200)})}static \u0275fac=function(t){return new(t||n)};static \u0275cmp=_({type:n,selectors:[["mat-expansion-panel"]],contentQueries:function(t,i,p){if(t&1&&J(p,un,5),t&2){let c;O(c=I())&&(i._lazyContent=c.first)}},viewQuery:function(t,i){if(t&1&&we(on,5)(rn,5),t&2){let p;O(p=I())&&(i._body=p.first),O(p=I())&&(i._bodyWrapper=p.first)}},hostAttrs:[1,"mat-expansion-panel"],hostVars:4,hostBindings:function(t,i){t&2&&A("mat-expanded",i.expanded)("mat-expansion-panel-spacing",i._hasSpacing())},inputs:{hideToggle:[2,"hideToggle","hideToggle",M],togglePosition:"togglePosition"},outputs:{afterExpand:"afterExpand",afterCollapse:"afterCollapse"},exportAs:["matExpansionPanel"],features:[D([{provide:te,useValue:void 0},{provide:Ge,useExisting:n}]),$,H],ngContentSelectors:dn,decls:9,vars:4,consts:[["bodyWrapper",""],["body",""],[1,"mat-expansion-panel-content-wrapper"],["role","region",1,"mat-expansion-panel-content",3,"id"],[1,"mat-expansion-panel-body"],[3,"cdkPortalOutlet"]],template:function(t,i){t&1&&(Y(sn),w(0),r(1,"div",2,0)(3,"div",3,1)(5,"div",4),w(6,1),be(7,ln,0,0,"ng-template",5),a(),w(8,2),a()()),t&2&&(l(),N("inert",i.expanded?null:""),l(2),m("id",i.id),N("aria-labelledby",i._headerId),l(4),m("cdkPortalOutlet",i._portal))},dependencies:[Ve],styles:[`.mat-expansion-panel {
  box-sizing: content-box;
  display: block;
  margin: 0;
  overflow: hidden;
}
.mat-expansion-panel.mat-expansion-panel-animations-enabled {
  transition: margin 225ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-expansion-panel {
  position: relative;
  background: var(--mat-expansion-container-background-color, var(--mat-sys-surface));
  color: var(--mat-expansion-container-text-color, var(--mat-sys-on-surface));
  border-radius: var(--mat-expansion-container-shape, 12px);
}
.mat-expansion-panel:not([class*=mat-elevation-z]) {
  box-shadow: var(--mat-expansion-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
}
.mat-accordion .mat-expansion-panel:not(.mat-expanded), .mat-accordion .mat-expansion-panel:not(.mat-expansion-panel-spacing) {
  border-radius: 0;
}
.mat-accordion .mat-expansion-panel:first-of-type {
  border-top-right-radius: var(--mat-expansion-container-shape, 12px);
  border-top-left-radius: var(--mat-expansion-container-shape, 12px);
}
.mat-accordion .mat-expansion-panel:last-of-type {
  border-bottom-right-radius: var(--mat-expansion-container-shape, 12px);
  border-bottom-left-radius: var(--mat-expansion-container-shape, 12px);
}
@media (forced-colors: active) {
  .mat-expansion-panel {
    outline: solid 1px;
  }
}

.mat-expansion-panel-content-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  grid-template-columns: 100%;
}
.mat-expansion-panel-animations-enabled .mat-expansion-panel-content-wrapper {
  transition: grid-template-rows 225ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-expansion-panel.mat-expanded > .mat-expansion-panel-content-wrapper {
  grid-template-rows: 1fr;
}
@supports not (grid-template-rows: 0fr) {
  .mat-expansion-panel-content-wrapper {
    height: 0;
  }
  .mat-expansion-panel.mat-expanded > .mat-expansion-panel-content-wrapper {
    height: auto;
  }
}
@media print {
  .mat-expansion-panel-content-wrapper {
    height: 0;
  }
  .mat-expansion-panel.mat-expanded > .mat-expansion-panel-content-wrapper {
    height: auto;
  }
}

.mat-expansion-panel-content {
  display: flex;
  flex-direction: column;
  overflow: visible;
  min-height: 0;
  visibility: hidden;
}
.mat-expansion-panel-animations-enabled .mat-expansion-panel-content {
  transition: visibility 190ms linear;
}
.mat-expansion-panel.mat-expanded > .mat-expansion-panel-content-wrapper > .mat-expansion-panel-content {
  visibility: visible;
}
.mat-expansion-panel-content {
  font-family: var(--mat-expansion-container-text-font, var(--mat-sys-body-large-font));
  font-size: var(--mat-expansion-container-text-size, var(--mat-sys-body-large-size));
  font-weight: var(--mat-expansion-container-text-weight, var(--mat-sys-body-large-weight));
  line-height: var(--mat-expansion-container-text-line-height, var(--mat-sys-body-large-line-height));
  letter-spacing: var(--mat-expansion-container-text-tracking, var(--mat-sys-body-large-tracking));
}

.mat-expansion-panel-body {
  padding: 0 24px 16px;
}

.mat-expansion-panel-spacing {
  margin: 16px 0;
}
.mat-accordion > .mat-expansion-panel-spacing:first-child, .mat-accordion > *:first-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing {
  margin-top: 0;
}
.mat-accordion > .mat-expansion-panel-spacing:last-child, .mat-accordion > *:last-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing {
  margin-bottom: 0;
}

.mat-action-row {
  border-top-style: solid;
  border-top-width: 1px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 16px 8px 16px 24px;
  border-top-color: var(--mat-expansion-actions-divider-color, var(--mat-sys-outline));
}
.mat-action-row .mat-button-base,
.mat-action-row .mat-mdc-button-base {
  margin-left: 8px;
}
[dir=rtl] .mat-action-row .mat-button-base,
[dir=rtl] .mat-action-row .mat-mdc-button-base {
  margin-left: 0;
  margin-right: 8px;
}
`],encapsulation:2,changeDetection:0})}return n})();var ae=(()=>{class n{panel=d(ie,{host:!0});_element=d(K);_focusMonitor=d(Re);_changeDetectorRef=d(B);_parentChangeSubscription=E.EMPTY;constructor(){d(Ie).load(Ue);let e=this.panel,t=d(Xe,{optional:!0}),i=d(new De("tabindex"),{optional:!0}),p=e.accordion?e.accordion._stateChanges.pipe(T(c=>!!(c.hideToggle||c.togglePosition))):oe;this.tabIndex=parseInt(i||"")||0,this._parentChangeSubscription=re(e.opened,e.closed,p,e._inputChanges.pipe(T(c=>!!(c.hideToggle||c.disabled||c.togglePosition)))).subscribe(()=>this._changeDetectorRef.markForCheck()),e.closed.pipe(T(()=>e._containsFocus())).subscribe(()=>this._focusMonitor.focusVia(this._element,"program")),t&&(this.expandedHeight=t.expandedHeight,this.collapsedHeight=t.collapsedHeight)}expandedHeight;collapsedHeight;tabIndex=0;get disabled(){return this.panel.disabled}_toggle(){this.disabled||this.panel.toggle()}_isExpanded(){return this.panel.expanded}_getExpandedState(){return this.panel._getExpandedState()}_getPanelId(){return this.panel.id}_getTogglePosition(){return this.panel.togglePosition}_showToggle(){return!this.panel.hideToggle&&!this.panel.disabled}_getHeaderHeight(){let e=this._isExpanded();return e&&this.expandedHeight?this.expandedHeight:!e&&this.collapsedHeight?this.collapsedHeight:null}_keydown(e){switch(e.keyCode){case 32:case 13:Be(e)||(e.preventDefault(),this._toggle());break;default:this.panel.accordion&&this.panel.accordion._handleHeaderKeydown(e);return}}focus(e,t){e?this._focusMonitor.focusVia(this._element,e,t):this._element.nativeElement.focus(t)}ngAfterViewInit(){this._focusMonitor.monitor(this._element).subscribe(e=>{e&&this.panel.accordion&&this.panel.accordion._handleHeaderFocus(this)})}ngOnDestroy(){this._parentChangeSubscription.unsubscribe(),this._focusMonitor.stopMonitoring(this._element)}static \u0275fac=function(t){return new(t||n)};static \u0275cmp=_({type:n,selectors:[["mat-expansion-panel-header"]],hostAttrs:["role","button",1,"mat-expansion-panel-header","mat-focus-indicator"],hostVars:13,hostBindings:function(t,i){t&1&&u("click",function(){return i._toggle()})("keydown",function(c){return i._keydown(c)}),t&2&&(N("id",i.panel._headerId)("tabindex",i.disabled?-1:i.tabIndex)("aria-controls",i._getPanelId())("aria-expanded",i._isExpanded())("aria-disabled",i.panel.disabled),Me("height",i._getHeaderHeight()),A("mat-expanded",i._isExpanded())("mat-expansion-toggle-indicator-after",i._getTogglePosition()==="after")("mat-expansion-toggle-indicator-before",i._getTogglePosition()==="before"))},inputs:{expandedHeight:"expandedHeight",collapsedHeight:"collapsedHeight",tabIndex:[2,"tabIndex","tabIndex",e=>e==null?0:Se(e)]},ngContentSelectors:cn,decls:5,vars:3,consts:[[1,"mat-content"],[1,"mat-expansion-indicator"],["xmlns","http://www.w3.org/2000/svg","viewBox","0 -960 960 960","aria-hidden","true","focusable","false"],["d","M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"]],template:function(t,i){t&1&&(Y(pn),R(0,"span",0),w(1),w(2,1),w(3,2),X(),b(4,mn,3,0,"span",1)),t&2&&(A("mat-content-hide-toggle",!i._showToggle()),l(4),C(i._showToggle()?4:-1))},styles:[`.mat-expansion-panel-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 24px;
  border-radius: inherit;
}
.mat-expansion-panel-animations-enabled .mat-expansion-panel-header {
  transition: height 225ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-expansion-panel-header::before {
  border-radius: inherit;
}
.mat-expansion-panel-header {
  height: var(--mat-expansion-header-collapsed-state-height, 48px);
  font-family: var(--mat-expansion-header-text-font, var(--mat-sys-title-medium-font));
  font-size: var(--mat-expansion-header-text-size, var(--mat-sys-title-medium-size));
  font-weight: var(--mat-expansion-header-text-weight, var(--mat-sys-title-medium-weight));
  line-height: var(--mat-expansion-header-text-line-height, var(--mat-sys-title-medium-line-height));
  letter-spacing: var(--mat-expansion-header-text-tracking, var(--mat-sys-title-medium-tracking));
}
.mat-expansion-panel-header.mat-expanded {
  height: var(--mat-expansion-header-expanded-state-height, 64px);
}
.mat-expansion-panel-header[aria-disabled=true] {
  color: var(--mat-expansion-header-disabled-state-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-expansion-panel-header:not([aria-disabled=true]) {
  cursor: pointer;
}
.mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:not([aria-disabled=true]):hover {
  background: var(--mat-expansion-header-hover-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-hover-state-layer-opacity) * 100%), transparent));
}
@media (hover: none) {
  .mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:not([aria-disabled=true]):hover {
    background: var(--mat-expansion-container-background-color, var(--mat-sys-surface));
  }
}
.mat-expansion-panel .mat-expansion-panel-header:not([aria-disabled=true]).cdk-keyboard-focused, .mat-expansion-panel .mat-expansion-panel-header:not([aria-disabled=true]).cdk-program-focused {
  background: var(--mat-expansion-header-focus-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-focus-state-layer-opacity) * 100%), transparent));
}
.mat-expansion-panel-header._mat-animation-noopable {
  transition: none;
}
.mat-expansion-panel-header:focus, .mat-expansion-panel-header:hover {
  outline: none;
}
.mat-expansion-panel-header.mat-expanded:focus, .mat-expansion-panel-header.mat-expanded:hover {
  background: inherit;
}
.mat-expansion-panel-header.mat-expansion-toggle-indicator-before {
  flex-direction: row-reverse;
}
.mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator {
  margin: 0 16px 0 0;
}
[dir=rtl] .mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator {
  margin: 0 0 0 16px;
}

.mat-content {
  display: flex;
  flex: 1;
  flex-direction: row;
  overflow: hidden;
}
.mat-content.mat-content-hide-toggle {
  margin-right: 8px;
}
[dir=rtl] .mat-content.mat-content-hide-toggle {
  margin-right: 0;
  margin-left: 8px;
}
.mat-expansion-toggle-indicator-before .mat-content.mat-content-hide-toggle {
  margin-left: 24px;
  margin-right: 0;
}
[dir=rtl] .mat-expansion-toggle-indicator-before .mat-content.mat-content-hide-toggle {
  margin-right: 24px;
  margin-left: 0;
}

.mat-expansion-panel-header-title {
  color: var(--mat-expansion-header-text-color, var(--mat-sys-on-surface));
}

.mat-expansion-panel-header-title,
.mat-expansion-panel-header-description {
  display: flex;
  flex-grow: 1;
  flex-basis: 0;
  margin-right: 16px;
  align-items: center;
}
[dir=rtl] .mat-expansion-panel-header-title,
[dir=rtl] .mat-expansion-panel-header-description {
  margin-right: 0;
  margin-left: 16px;
}
.mat-expansion-panel-header[aria-disabled=true] .mat-expansion-panel-header-title,
.mat-expansion-panel-header[aria-disabled=true] .mat-expansion-panel-header-description {
  color: inherit;
}

.mat-expansion-panel-header-description {
  flex-grow: 2;
  color: var(--mat-expansion-header-description-color, var(--mat-sys-on-surface-variant));
}

.mat-expansion-panel-animations-enabled .mat-expansion-indicator {
  transition: transform 225ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-expansion-panel-header.mat-expanded .mat-expansion-indicator {
  transform: rotate(180deg);
}
.mat-expansion-indicator::after {
  border-style: solid;
  border-width: 0 2px 2px 0;
  content: "";
  padding: 3px;
  transform: rotate(45deg);
  vertical-align: middle;
  color: var(--mat-expansion-header-indicator-color, var(--mat-sys-on-surface-variant));
  display: var(--mat-expansion-legacy-header-indicator-display, none);
}
.mat-expansion-indicator svg {
  width: 24px;
  height: 24px;
  margin: 0 -8px;
  vertical-align: middle;
  fill: var(--mat-expansion-header-indicator-color, var(--mat-sys-on-surface-variant));
  display: var(--mat-expansion-header-indicator-display, inline-block);
}

@media (forced-colors: active) {
  .mat-expansion-panel-content {
    border-top: 1px solid;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
}
`],encapsulation:2,changeDetection:0})}return n})();var Ye=(()=>{class n{static \u0275fac=function(t){return new(t||n)};static \u0275dir=y({type:n,selectors:[["mat-panel-title"]],hostAttrs:[1,"mat-expansion-panel-header-title"]})}return n})(),Je=(()=>{class n extends Ze{_keyManager;_ownHeaders=new ge;_headers;hideToggle=!1;displayMode="default";togglePosition="after";ngAfterContentInit(){this._headers.changes.pipe(Z(this._headers)).subscribe(e=>{this._ownHeaders.reset(e.filter(t=>t.panel.accordion===this)),this._ownHeaders.notifyOnChanges()}),this._keyManager=new Le(this._ownHeaders).withWrap().withHomeAndEnd()}_handleHeaderKeydown(e){this._keyManager.onKeydown(e)}_handleHeaderFocus(e){this._keyManager.updateActiveItem(e)}ngOnDestroy(){super.ngOnDestroy(),this._keyManager?.destroy(),this._ownHeaders.destroy()}static \u0275fac=(()=>{let e;return function(i){return(e||(e=he(n)))(i||n)}})();static \u0275dir=y({type:n,selectors:[["mat-accordion"]],contentQueries:function(t,i,p){if(t&1&&J(p,ae,5),t&2){let c;O(c=I())&&(i._headers=c)}},hostAttrs:[1,"mat-accordion"],hostVars:2,hostBindings:function(t,i){t&2&&A("mat-accordion-multi",i.multi)},inputs:{hideToggle:[2,"hideToggle","hideToggle",M],displayMode:"displayMode",togglePosition:"togglePosition"},exportAs:["matAccordion"],features:[D([{provide:te,useExisting:n}]),$]})}return n})(),en=(()=>{class n{static \u0275fac=function(t){return new(t||n)};static \u0275mod=j({type:n});static \u0275inj=F({imports:[$e,We,Ae]})}return n})();function fn(n,o){if(n&1&&(r(0,"li")(1,"mat-icon",13),s(2,"check_circle"),a(),r(3,"span"),s(4),a()()),n&2){let e=o.$implicit;l(4),h(e)}}function _n(n,o){if(n&1&&(r(0,"li")(1,"mat-icon",13),s(2,"check_circle"),a(),r(3,"span"),s(4),a()()),n&2){let e=o.$implicit;l(4),h(e)}}function yn(n,o){if(n&1&&(r(0,"li")(1,"mat-icon",13),s(2,"add_circle"),a(),r(3,"span"),s(4),a()()),n&2){let e=o.$implicit;l(4),h(e)}}function bn(n,o){if(n&1&&(r(0,"li")(1,"mat-icon",14),s(2,"remove_circle"),a(),r(3,"span"),s(4),a()()),n&2){let e=o.$implicit;l(4),h(e)}}function Cn(n,o){if(n&1&&(r(0,"li")(1,"mat-icon",14),s(2,"error_outline"),a(),r(3,"span"),s(4),a()()),n&2){let e=o.$implicit;l(4),h(e)}}function vn(n,o){if(n&1&&(r(0,"mat-expansion-panel")(1,"mat-expansion-panel-header")(2,"mat-panel-title")(3,"mat-icon",7),s(4,"warning"),a(),s(5," Wa\u017Cne ostrze\u017Cenia "),a()(),r(6,"ul",6),x(7,Cn,5,1,"li",null,k),a()()),n&2){let e=v();l(7),f(e.condition.warnings)}}function wn(n,o){if(n&1&&(r(0,"a",9)(1,"mat-icon"),s(2,"picture_as_pdf"),a(),s(3," Wytyczne NCE\u017B (PDF) "),a()),n&2){let e=v();m("href",e.condition.pdfURL,xe)}}var U=class n{condition;expandedByDefault=!1;router=d(Q);goToRecipesWithCondition(){this.router.navigate(["/przepisy"],{queryParams:{condition:this.condition.name}})}goToDietPlans(){this.router.navigate(["/jadlospisy"],{queryParams:{condition:this.condition.name}})}static \u0275fac=function(e){return new(e||n)};static \u0275cmp=_({type:n,selectors:[["app-medical-condition-card"]],inputs:{condition:"condition",expandedByDefault:"expandedByDefault"},decls:59,vars:7,consts:[[1,"condition-card","surface-card"],[1,"condition-card__head"],[1,"condition-card__icon"],["multi","",1,"condition-accordion"],[3,"expanded"],[1,"panel-icon"],[1,"rec-list"],[1,"panel-icon","panel-icon--warn"],[1,"condition-card__footer"],["target","_blank","rel","noopener noreferrer",1,"btn","btn-secondary",3,"href"],[1,"condition-card__ctas"],["type","button",1,"btn","btn-secondary",3,"click"],["type","button",1,"btn","btn-primary",3,"click"],[1,"icon-ok"],[1,"icon-warn"]],template:function(e,t){e&1&&(r(0,"article",0)(1,"div",1)(2,"div",2)(3,"mat-icon"),s(4),a()(),r(5,"div")(6,"h2"),s(7),a(),r(8,"p"),s(9),a()()(),r(10,"mat-accordion",3)(11,"mat-expansion-panel",4)(12,"mat-expansion-panel-header")(13,"mat-panel-title")(14,"mat-icon",5),s(15,"restaurant"),a(),s(16," Zalecenia \u017Cywieniowe "),a()(),r(17,"ul",6),x(18,fn,5,1,"li",null,k),a()(),r(20,"mat-expansion-panel")(21,"mat-expansion-panel-header")(22,"mat-panel-title")(23,"mat-icon",5),s(24,"directions_run"),a(),s(25," Zalecenia dotycz\u0105ce stylu \u017Cycia "),a()(),r(26,"ul",6),x(27,_n,5,1,"li",null,k),a()(),r(29,"mat-expansion-panel",4)(30,"mat-expansion-panel-header")(31,"mat-panel-title")(32,"mat-icon",5),s(33,"local_dining"),a(),s(34," Produkty zalecane "),a()(),r(35,"ul",6),x(36,yn,5,1,"li",null,k),a()(),r(38,"mat-expansion-panel")(39,"mat-expansion-panel-header")(40,"mat-panel-title")(41,"mat-icon",7),s(42,"block"),a(),s(43," Produkty niewskazane "),a()(),r(44,"ul",6),x(45,bn,5,1,"li",null,k),a()(),b(47,vn,9,0,"mat-expansion-panel"),a(),r(48,"div",8),b(49,wn,4,1,"a",9),r(50,"div",10)(51,"button",11),u("click",function(){return t.goToDietPlans()}),r(52,"mat-icon"),s(53,"calendar_month"),a(),s(54," Gotowe jad\u0142ospisy "),a(),r(55,"button",12),u("click",function(){return t.goToRecipesWithCondition()}),s(56," Zobacz dopasowane przepisy "),r(57,"mat-icon"),s(58,"arrow_forward"),a()()()()()),e&2&&(l(4),h(t.condition.icon||"health_and_safety"),l(3),h(t.condition.name),l(2),h(t.condition.description),l(2),m("expanded",t.expandedByDefault),l(7),f(t.condition.dietaryRecommendations),l(9),f(t.condition.lifestyleRecommendations),l(2),m("expanded",t.expandedByDefault),l(7),f(t.condition.foodsToEat),l(9),f(t.condition.foodsToAvoid),l(2),C(t.condition.warnings&&t.condition.warnings.length>0?47:-1),l(2),C(t.condition.pdfURL?49:-1))},dependencies:[L,en,Je,ie,ae,Ye,W,V],styles:[".condition-card[_ngcontent-%COMP%]{padding:1.5rem 1.75rem;display:flex;flex-direction:column;gap:1.25rem}.condition-card__head[_ngcontent-%COMP%]{display:flex;align-items:flex-start;gap:1rem}.condition-card__head[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:1.35rem;margin-bottom:.4rem}.condition-card__head[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0;font-size:.94rem;line-height:1.65}.condition-card__icon[_ngcontent-%COMP%]{width:48px;height:48px;border-radius:14px;background:var(--accent-soft);color:var(--accent-dark);display:inline-flex;align-items:center;justify-content:center;flex-shrink:0}.condition-accordion[_ngcontent-%COMP%]     .mat-expansion-panel{box-shadow:none!important;border:1px solid var(--border-subtle);border-radius:12px!important;margin-bottom:.5rem;background:var(--bg-subtle);color:var(--ink-primary)}.condition-accordion[_ngcontent-%COMP%]     .mat-expansion-panel-header{font-family:Plus Jakarta Sans,sans-serif;font-weight:600;font-size:.94rem}.condition-accordion[_ngcontent-%COMP%]     .mat-expansion-panel-header-title{color:var(--ink-primary)}.panel-icon[_ngcontent-%COMP%]{margin-right:.55rem;color:var(--accent-primary);font-size:20px;width:20px;height:20px}.panel-icon--warn[_ngcontent-%COMP%]{color:#e53935}.rec-list[_ngcontent-%COMP%]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.55rem}.rec-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{display:flex;align-items:flex-start;gap:.55rem;font-size:.9rem;color:var(--ink-primary);line-height:1.5}.rec-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:18px;width:18px;height:18px;margin-top:2px;flex-shrink:0}.icon-ok[_ngcontent-%COMP%]{color:#20b27f}.icon-warn[_ngcontent-%COMP%]{color:#e53935}.condition-card__footer[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:.75rem;flex-wrap:wrap;padding-top:.85rem;border-top:1px solid var(--border-subtle)}.condition-card__ctas[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.6rem;flex-wrap:wrap;margin-left:auto}@media(max-width:640px){.condition-card[_ngcontent-%COMP%]{padding:1.15rem;gap:1rem}.condition-card__head[_ngcontent-%COMP%]{gap:.75rem}.condition-card__head[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:1.18rem}.condition-card__icon[_ngcontent-%COMP%]{width:40px;height:40px;border-radius:11px}.condition-card__footer[_ngcontent-%COMP%]{flex-direction:column;align-items:stretch}.condition-card__ctas[_ngcontent-%COMP%]{width:100%;margin-left:0;display:grid;grid-template-columns:1fr;gap:.5rem}.condition-card__ctas[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{width:100%}}"]})};var Mn=(n,o)=>o.id;function En(n,o){n&1&&G(0,"app-loading-state",4),n&2&&m("count",4)}function Pn(n,o){if(n&1&&G(0,"app-medical-condition-card",6),n&2){let e=o.$implicit,t=v(2);m("condition",e)("expandedByDefault",t.selectedConditionId===e.id)}}function kn(n,o){if(n&1){let e=ve();r(0,"div",7)(1,"mat-icon"),s(2,"search_off"),a(),r(3,"h3"),s(4,"Nie znaleziono pasuj\u0105cej jednostki chorobowej"),a(),r(5,"button",8),u("click",function(){de(e);let i=v(2);return i.searchQuery="",le(i.selectCondition(null))}),s(6," Poka\u017C wszystkie "),a()()}}function Dn(n,o){if(n&1&&(r(0,"div",5),x(1,Pn,1,2,"app-medical-condition-card",6,Mn,!1,kn,7,0,"div",7),a()),n&2){let e=v();l(),f(e.visibleConditions)}}var nn=class n{medicalConditionService=d(Ne);route=d(Te);router=d(Q);sub=new E;allConditions=[];selectedConditionId=null;searchQuery="";loading=!0;ngOnInit(){this.sub.add(this.medicalConditionService.getMedicalConditions().subscribe(o=>{this.allConditions=o,this.loading=!1})),this.sub.add(this.route.paramMap.subscribe(o=>{this.selectedConditionId=o.get("id")}))}ngOnDestroy(){this.sub.unsubscribe()}get conditionFilterItems(){return[{value:"",label:"Wszystkie",count:this.allConditions.length},...this.allConditions.map(o=>({value:o.id,label:o.name}))]}get visibleConditions(){let o=this.allConditions;if(this.selectedConditionId){let t=o.find(i=>i.id===this.selectedConditionId);if(t)return[t]}let e=this.searchQuery.trim().toLowerCase();return e&&(o=o.filter(t=>t.name.toLowerCase().includes(e)||t.description.toLowerCase().includes(e))),o}selectCondition(o){o?this.router.navigate(["/choroby",o]):this.router.navigate(["/choroby"])}static \u0275fac=function(e){return new(e||n)};static \u0275cmp=_({type:n,selectors:[["app-conditions"]],decls:6,vars:4,consts:[["title","Choroby dietozale\u017Cne","description","Poznaj najwa\u017Cniejsze jednostki chorobowe i sprawd\u017A oparte na wytycznych NCE\u017B zalecenia \u017Cywieniowe, produkty wskazane i niewskazane oraz pasuj\u0105ce przepisy."],["placeholder","Szukaj choroby...","ariaLabel","Szukaj jednostki chorobowej",1,"header-search",3,"valueChange","value"],[1,"container","conditions-page","fade-in"],[3,"selected","items","activeValue"],["variant","list","label","Wczytywanie chor\xF3b i zalece\u0144...",3,"count"],[1,"conditions-list"],[3,"condition","expandedByDefault"],[1,"surface-card","empty-box"],["type","button",1,"btn","btn-primary",3,"click"]],template:function(e,t){e&1&&(r(0,"app-presentation-header",0)(1,"app-search-input",1),ke("valueChange",function(p){return Pe(t.searchQuery,p)||(t.searchQuery=p),p}),u("valueChange",function(){return t.selectedConditionId=null}),a()(),r(2,"div",2)(3,"app-filter-strip",3),u("selected",function(p){return t.selectCondition(p||null)}),a(),b(4,En,1,1,"app-loading-state",4)(5,Dn,4,1,"div",5),a()),e&2&&(l(),Ee("value",t.searchQuery),l(2),m("items",t.conditionFilterItems)("activeValue",t.selectedConditionId||""),l(),C(t.loading?4:5))},dependencies:[L,ze,W,V,U,He,Oe,je,Fe],styles:[".header-search[_ngcontent-%COMP%]{width:248px}.conditions-page[_ngcontent-%COMP%]{padding-top:2rem;padding-bottom:3.5rem;display:flex;flex-direction:column;gap:1.5rem}.conditions-list[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:1.25rem}.empty-box[_ngcontent-%COMP%]{padding:3rem 1.5rem;text-align:center;display:flex;flex-direction:column;align-items:center;gap:.75rem}.empty-box[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:46px;width:46px;height:46px;color:var(--ink-muted)}@media(max-width:640px){.header-search[_ngcontent-%COMP%]{width:100%}}"]})};export{nn as ConditionsComponent};
