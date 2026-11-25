import{a as je}from"./chunk-BKLWX5QB.js";import{B as Qe,C as Ve,D as We,E as qe,i as Ne,p as Re,r as Be,s as z,w as q,y as Le}from"./chunk-77X27SCW.js";import{A as W,Aa as He,f as L,k as Te,m as Q,s as Ie,ta as ze,u as Ae,wa as Fe,y as Oe,z as V}from"./chunk-P2GG5NX5.js";import{$ as w,$b as A,Aa as K,B as oe,Ba as he,Bb as S,C as D,Db as T,Eb as M,Gb as x,H as re,Hb as f,Hc as De,Ib as m,Jb as o,Kb as a,Lb as be,Lc as B,Mb as R,Nb as G,Nc as C,Ob as Ce,Oc as Se,Pb as ve,Q as Z,Tb as u,Ua as ge,Vb as E,Wb as X,Xb as b,Ya as l,Yb as Y,Z as F,Zb as we,_b as I,ba as d,cb as xe,eb as fe,ec as Me,fc as O,g as v,ha as se,hb as _e,hc as s,ia as de,ic as h,j as k,ja as le,lb as _,m as ae,ma as pe,mb as j,nb as y,oc as Ee,pa as g,pb as $,pc as Pe,qa as ce,qb as ye,qc as ke,ta as me,uc as P,xa as H,ya as ue,zb as N}from"./chunk-A3FAUHTG.js";var J=new w("CdkAccordion"),Ue=(()=>{class t{_stateChanges=new k;_openCloseAllActions=new k;id=d(z).getId("cdk-accordion-");multi=!1;openAll(){this.multi&&this._openCloseAllActions.next(!0)}closeAll(){this._openCloseAllActions.next(!1)}ngOnChanges(e){this._stateChanges.next(e)}ngOnDestroy(){this._stateChanges.complete(),this._openCloseAllActions.complete()}static \u0275fac=function(n){return new(n||t)};static \u0275dir=y({type:t,selectors:[["cdk-accordion"],["","cdkAccordion",""]],inputs:{multi:[2,"multi","multi",C]},exportAs:["cdkAccordion"],features:[P([{provide:J,useExisting:t}]),H]})}return t})(),Ze=(()=>{class t{accordion=d(J,{optional:!0,skipSelf:!0});_changeDetectorRef=d(B);_expansionDispatcher=d(q);_openCloseAllSubscription=v.EMPTY;closed=new g;opened=new g;destroyed=new g;expandedChange=new g;id=d(z).getId("cdk-accordion-child-");get expanded(){return this._expanded}set expanded(e){if(this._expanded!==e){if(this._expanded=e,this.expandedChange.emit(e),e){this.opened.emit();let n=this.accordion?this.accordion.id:this.id;this._expansionDispatcher.notify(this.id,n)}else this.closed.emit();this._changeDetectorRef.markForCheck()}}_expanded=!1;get disabled(){return this._disabled()}set disabled(e){this._disabled.set(e)}_disabled=me(!1);_removeUniqueSelectionListener=()=>{};constructor(){}ngOnInit(){this._removeUniqueSelectionListener=this._expansionDispatcher.listen((e,n)=>{this.accordion&&!this.accordion.multi&&this.accordion.id===n&&this.id!==e&&(this.expanded=!1)}),this.accordion&&(this._openCloseAllSubscription=this._subscribeToOpenCloseAllActions())}ngOnDestroy(){this.opened.complete(),this.closed.complete(),this.destroyed.emit(),this.destroyed.complete(),this._removeUniqueSelectionListener(),this._openCloseAllSubscription.unsubscribe()}toggle(){this.disabled||(this.expanded=!this.expanded)}close(){this.disabled||(this.expanded=!1)}open(){this.disabled||(this.expanded=!0)}_subscribeToOpenCloseAllActions(){return this.accordion._openCloseAllActions.subscribe(e=>{this.disabled||(this.expanded=e)})}static \u0275fac=function(n){return new(n||t)};static \u0275dir=y({type:t,selectors:[["cdk-accordion-item"],["","cdkAccordionItem",""]],inputs:{expanded:[2,"expanded","expanded",C],disabled:[2,"disabled","disabled",C]},outputs:{closed:"closed",opened:"opened",destroyed:"destroyed",expandedChange:"expandedChange"},exportAs:["cdkAccordionItem"],features:[P([{provide:J,useValue:void 0}])]})}return t})(),Ke=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=j({type:t});static \u0275inj=F({})}return t})();var an=["body"],on=["bodyWrapper"],rn=[[["mat-expansion-panel-header"]],"*",[["mat-action-row"]]],sn=["mat-expansion-panel-header","*","mat-action-row"];function dn(t,r){}var ln=[[["mat-panel-title"]],[["mat-panel-description"]],"*"],pn=["mat-panel-title","mat-panel-description","*"];function cn(t,r){t&1&&(R(0,"span",1),le(),R(1,"svg",2),Ce(2,"path",3),G()())}var ne=new w("MAT_ACCORDION"),$e=new w("MAT_EXPANSION_PANEL"),mn=(()=>{class t{_template=d(xe);_expansionPanel=d($e,{optional:!0});constructor(){}static \u0275fac=function(n){return new(n||t)};static \u0275dir=y({type:t,selectors:[["ng-template","matExpansionPanelContent",""]]})}return t})(),Ge=new w("MAT_EXPANSION_PANEL_DEFAULT_OPTIONS"),te=(()=>{class t extends Ze{_viewContainerRef=d(_e);_animationsDisabled=We();_document=d(pe);_ngZone=d(ce);_elementRef=d(K);_renderer=d(fe);_cleanupTransitionEnd;get hideToggle(){return this._hideToggle||this.accordion&&this.accordion.hideToggle}set hideToggle(e){this._hideToggle=e}_hideToggle=!1;get togglePosition(){return this._togglePosition||this.accordion&&this.accordion.togglePosition}set togglePosition(e){this._togglePosition=e}_togglePosition;afterExpand=new g;afterCollapse=new g;_inputChanges=new k;accordion=d(ne,{optional:!0,skipSelf:!0});_lazyContent;_body;_bodyWrapper;_portal;_headerId=d(z).getId("mat-expansion-panel-header-");constructor(){super();let e=d(Ge,{optional:!0});this._expansionDispatcher=d(q),e&&(this.hideToggle=e.hideToggle)}_hasSpacing(){return this.accordion?this.expanded&&this.accordion.displayMode==="default":!1}_getExpandedState(){return this.expanded?"expanded":"collapsed"}toggle(){this.expanded=!this.expanded}close(){this.expanded=!1}open(){this.expanded=!0}ngAfterContentInit(){this._lazyContent&&this._lazyContent._expansionPanel===this&&this.opened.pipe(Z(null),D(()=>this.expanded&&!this._portal),re(1)).subscribe(()=>{this._portal=new Le(this._lazyContent._template,this._viewContainerRef)}),this._setupAnimationEvents()}ngOnChanges(e){this._inputChanges.next(e)}ngOnDestroy(){super.ngOnDestroy(),this._cleanupTransitionEnd?.(),this._inputChanges.complete()}_containsFocus(){if(this._body){let e=this._document.activeElement,n=this._body.nativeElement;return e===n||n.contains(e)}return!1}_transitionEndListener=({target:e,propertyName:n})=>{e===this._bodyWrapper?.nativeElement&&n==="grid-template-rows"&&this._ngZone.run(()=>{this.expanded?this.afterExpand.emit():this.afterCollapse.emit()})};_setupAnimationEvents(){this._ngZone.runOutsideAngular(()=>{this._animationsDisabled?(this.opened.subscribe(()=>this._ngZone.run(()=>this.afterExpand.emit())),this.closed.subscribe(()=>this._ngZone.run(()=>this.afterCollapse.emit()))):setTimeout(()=>{let e=this._elementRef.nativeElement;this._cleanupTransitionEnd=this._renderer.listen(e,"transitionend",this._transitionEndListener),e.classList.add("mat-expansion-panel-animations-enabled")},200)})}static \u0275fac=function(n){return new(n||t)};static \u0275cmp=_({type:t,selectors:[["mat-expansion-panel"]],contentQueries:function(n,i,p){if(n&1&&Y(p,mn,5),n&2){let c;I(c=A())&&(i._lazyContent=c.first)}},viewQuery:function(n,i){if(n&1&&we(an,5)(on,5),n&2){let p;I(p=A())&&(i._body=p.first),I(p=A())&&(i._bodyWrapper=p.first)}},hostAttrs:[1,"mat-expansion-panel"],hostVars:4,hostBindings:function(n,i){n&2&&O("mat-expanded",i.expanded)("mat-expansion-panel-spacing",i._hasSpacing())},inputs:{hideToggle:[2,"hideToggle","hideToggle",C],togglePosition:"togglePosition"},outputs:{afterExpand:"afterExpand",afterCollapse:"afterCollapse"},exportAs:["matExpansionPanel"],features:[P([{provide:ne,useValue:void 0},{provide:$e,useExisting:t}]),$,H],ngContentSelectors:sn,decls:9,vars:4,consts:[["bodyWrapper",""],["body",""],[1,"mat-expansion-panel-content-wrapper"],["role","region",1,"mat-expansion-panel-content",3,"id"],[1,"mat-expansion-panel-body"],[3,"cdkPortalOutlet"]],template:function(n,i){n&1&&(X(rn),b(0),o(1,"div",2,0)(3,"div",3,1)(5,"div",4),b(6,1),ye(7,dn,0,0,"ng-template",5),a(),b(8,2),a()()),n&2&&(l(),N("inert",i.expanded?null:""),l(2),m("id",i.id),N("aria-labelledby",i._headerId),l(4),m("cdkPortalOutlet",i._portal))},dependencies:[Qe],styles:[`.mat-expansion-panel {
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
`],encapsulation:2,changeDetection:0})}return t})();var ie=(()=>{class t{panel=d(te,{host:!0});_element=d(K);_focusMonitor=d(Ne);_changeDetectorRef=d(B);_parentChangeSubscription=v.EMPTY;constructor(){d(Ae).load(qe);let e=this.panel,n=d(Ge,{optional:!0}),i=d(new De("tabindex"),{optional:!0}),p=e.accordion?e.accordion._stateChanges.pipe(D(c=>!!(c.hideToggle||c.togglePosition))):ae;this.tabIndex=parseInt(i||"")||0,this._parentChangeSubscription=oe(e.opened,e.closed,p,e._inputChanges.pipe(D(c=>!!(c.hideToggle||c.disabled||c.togglePosition)))).subscribe(()=>this._changeDetectorRef.markForCheck()),e.closed.pipe(D(()=>e._containsFocus())).subscribe(()=>this._focusMonitor.focusVia(this._element,"program")),n&&(this.expandedHeight=n.expandedHeight,this.collapsedHeight=n.collapsedHeight)}expandedHeight;collapsedHeight;tabIndex=0;get disabled(){return this.panel.disabled}_toggle(){this.disabled||this.panel.toggle()}_isExpanded(){return this.panel.expanded}_getExpandedState(){return this.panel._getExpandedState()}_getPanelId(){return this.panel.id}_getTogglePosition(){return this.panel.togglePosition}_showToggle(){return!this.panel.hideToggle&&!this.panel.disabled}_getHeaderHeight(){let e=this._isExpanded();return e&&this.expandedHeight?this.expandedHeight:!e&&this.collapsedHeight?this.collapsedHeight:null}_keydown(e){switch(e.keyCode){case 32:case 13:Re(e)||(e.preventDefault(),this._toggle());break;default:this.panel.accordion&&this.panel.accordion._handleHeaderKeydown(e);return}}focus(e,n){e?this._focusMonitor.focusVia(this._element,e,n):this._element.nativeElement.focus(n)}ngAfterViewInit(){this._focusMonitor.monitor(this._element).subscribe(e=>{e&&this.panel.accordion&&this.panel.accordion._handleHeaderFocus(this)})}ngOnDestroy(){this._parentChangeSubscription.unsubscribe(),this._focusMonitor.stopMonitoring(this._element)}static \u0275fac=function(n){return new(n||t)};static \u0275cmp=_({type:t,selectors:[["mat-expansion-panel-header"]],hostAttrs:["role","button",1,"mat-expansion-panel-header","mat-focus-indicator"],hostVars:13,hostBindings:function(n,i){n&1&&u("click",function(){return i._toggle()})("keydown",function(c){return i._keydown(c)}),n&2&&(N("id",i.panel._headerId)("tabindex",i.disabled?-1:i.tabIndex)("aria-controls",i._getPanelId())("aria-expanded",i._isExpanded())("aria-disabled",i.panel.disabled),Me("height",i._getHeaderHeight()),O("mat-expanded",i._isExpanded())("mat-expansion-toggle-indicator-after",i._getTogglePosition()==="after")("mat-expansion-toggle-indicator-before",i._getTogglePosition()==="before"))},inputs:{expandedHeight:"expandedHeight",collapsedHeight:"collapsedHeight",tabIndex:[2,"tabIndex","tabIndex",e=>e==null?0:Se(e)]},ngContentSelectors:pn,decls:5,vars:3,consts:[[1,"mat-content"],[1,"mat-expansion-indicator"],["xmlns","http://www.w3.org/2000/svg","viewBox","0 -960 960 960","aria-hidden","true","focusable","false"],["d","M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"]],template:function(n,i){n&1&&(X(ln),R(0,"span",0),b(1),b(2,1),b(3,2),G(),S(4,cn,3,0,"span",1)),n&2&&(O("mat-content-hide-toggle",!i._showToggle()),l(4),T(i._showToggle()?4:-1))},styles:[`.mat-expansion-panel-header {
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
`],encapsulation:2,changeDetection:0})}return t})();var Xe=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275dir=y({type:t,selectors:[["mat-panel-title"]],hostAttrs:[1,"mat-expansion-panel-header-title"]})}return t})(),Ye=(()=>{class t extends Ue{_keyManager;_ownHeaders=new he;_headers;hideToggle=!1;displayMode="default";togglePosition="after";ngAfterContentInit(){this._headers.changes.pipe(Z(this._headers)).subscribe(e=>{this._ownHeaders.reset(e.filter(n=>n.panel.accordion===this)),this._ownHeaders.notifyOnChanges()}),this._keyManager=new Be(this._ownHeaders).withWrap().withHomeAndEnd()}_handleHeaderKeydown(e){this._keyManager.onKeydown(e)}_handleHeaderFocus(e){this._keyManager.updateActiveItem(e)}ngOnDestroy(){super.ngOnDestroy(),this._keyManager?.destroy(),this._ownHeaders.destroy()}static \u0275fac=(()=>{let e;return function(i){return(e||(e=ue(t)))(i||t)}})();static \u0275dir=y({type:t,selectors:[["mat-accordion"]],contentQueries:function(n,i,p){if(n&1&&Y(p,ie,5),n&2){let c;I(c=A())&&(i._headers=c)}},hostAttrs:[1,"mat-accordion"],hostVars:2,hostBindings:function(n,i){n&2&&O("mat-accordion-multi",i.multi)},inputs:{hideToggle:[2,"hideToggle","hideToggle",C],displayMode:"displayMode",togglePosition:"togglePosition"},exportAs:["matAccordion"],features:[P([{provide:ne,useExisting:t}]),$]})}return t})(),Je=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=j({type:t});static \u0275inj=F({imports:[Ke,Ve,Oe]})}return t})();function xn(t,r){if(t&1&&(o(0,"li")(1,"mat-icon",13),s(2,"check_circle"),a(),o(3,"span"),s(4),a()()),t&2){let e=r.$implicit;l(4),h(e)}}function fn(t,r){if(t&1&&(o(0,"li")(1,"mat-icon",13),s(2,"check_circle"),a(),o(3,"span"),s(4),a()()),t&2){let e=r.$implicit;l(4),h(e)}}function _n(t,r){if(t&1&&(o(0,"li")(1,"mat-icon",13),s(2,"add_circle"),a(),o(3,"span"),s(4),a()()),t&2){let e=r.$implicit;l(4),h(e)}}function yn(t,r){if(t&1&&(o(0,"li")(1,"mat-icon",14),s(2,"remove_circle"),a(),o(3,"span"),s(4),a()()),t&2){let e=r.$implicit;l(4),h(e)}}function bn(t,r){if(t&1&&(o(0,"li")(1,"mat-icon",14),s(2,"error_outline"),a(),o(3,"span"),s(4),a()()),t&2){let e=r.$implicit;l(4),h(e)}}function Cn(t,r){if(t&1&&(o(0,"mat-expansion-panel")(1,"mat-expansion-panel-header")(2,"mat-panel-title")(3,"mat-icon",7),s(4,"warning"),a(),s(5," Wa\u017Cne ostrze\u017Cenia "),a()(),o(6,"ul",6),x(7,bn,5,1,"li",null,M),a()()),t&2){let e=E();l(7),f(e.condition.warnings)}}function vn(t,r){if(t&1&&(o(0,"a",9)(1,"mat-icon"),s(2,"picture_as_pdf"),a(),s(3," Wytyczne NCE\u017B (PDF) "),a()),t&2){let e=E();m("href",e.condition.pdfURL,ge)}}var U=class t{condition;expandedByDefault=!1;router=d(Q);goToRecipesWithCondition(){this.router.navigate(["/przepisy"],{queryParams:{condition:this.condition.name}})}goToDietPlans(){this.router.navigate(["/jadlospisy"],{queryParams:{condition:this.condition.name}})}static \u0275fac=function(e){return new(e||t)};static \u0275cmp=_({type:t,selectors:[["app-medical-condition-card"]],inputs:{condition:"condition",expandedByDefault:"expandedByDefault"},decls:59,vars:7,consts:[[1,"condition-card","surface-card"],[1,"condition-card__head"],[1,"condition-card__icon"],["multi","",1,"condition-accordion"],[3,"expanded"],[1,"panel-icon"],[1,"rec-list"],[1,"panel-icon","panel-icon--warn"],[1,"condition-card__footer"],["target","_blank","rel","noopener noreferrer",1,"btn","btn-secondary",3,"href"],[1,"condition-card__ctas"],["type","button",1,"btn","btn-secondary",3,"click"],["type","button",1,"btn","btn-primary",3,"click"],[1,"icon-ok"],[1,"icon-warn"]],template:function(e,n){e&1&&(o(0,"article",0)(1,"div",1)(2,"div",2)(3,"mat-icon"),s(4),a()(),o(5,"div")(6,"h2"),s(7),a(),o(8,"p"),s(9),a()()(),o(10,"mat-accordion",3)(11,"mat-expansion-panel",4)(12,"mat-expansion-panel-header")(13,"mat-panel-title")(14,"mat-icon",5),s(15,"restaurant"),a(),s(16," Zalecenia \u017Cywieniowe "),a()(),o(17,"ul",6),x(18,xn,5,1,"li",null,M),a()(),o(20,"mat-expansion-panel")(21,"mat-expansion-panel-header")(22,"mat-panel-title")(23,"mat-icon",5),s(24,"directions_run"),a(),s(25," Zalecenia dotycz\u0105ce stylu \u017Cycia "),a()(),o(26,"ul",6),x(27,fn,5,1,"li",null,M),a()(),o(29,"mat-expansion-panel",4)(30,"mat-expansion-panel-header")(31,"mat-panel-title")(32,"mat-icon",5),s(33,"local_dining"),a(),s(34," Produkty zalecane "),a()(),o(35,"ul",6),x(36,_n,5,1,"li",null,M),a()(),o(38,"mat-expansion-panel")(39,"mat-expansion-panel-header")(40,"mat-panel-title")(41,"mat-icon",7),s(42,"block"),a(),s(43," Produkty niewskazane "),a()(),o(44,"ul",6),x(45,yn,5,1,"li",null,M),a()(),S(47,Cn,9,0,"mat-expansion-panel"),a(),o(48,"div",8),S(49,vn,4,1,"a",9),o(50,"div",10)(51,"button",11),u("click",function(){return n.goToDietPlans()}),o(52,"mat-icon"),s(53,"calendar_month"),a(),s(54," Gotowe jad\u0142ospisy "),a(),o(55,"button",12),u("click",function(){return n.goToRecipesWithCondition()}),s(56," Zobacz dopasowane przepisy "),o(57,"mat-icon"),s(58,"arrow_forward"),a()()()()()),e&2&&(l(4),h(n.condition.icon||"health_and_safety"),l(3),h(n.condition.name),l(2),h(n.condition.description),l(2),m("expanded",n.expandedByDefault),l(7),f(n.condition.dietaryRecommendations),l(9),f(n.condition.lifestyleRecommendations),l(2),m("expanded",n.expandedByDefault),l(7),f(n.condition.foodsToEat),l(9),f(n.condition.foodsToAvoid),l(2),T(n.condition.warnings&&n.condition.warnings.length>0?47:-1),l(2),T(n.condition.pdfURL?49:-1))},dependencies:[L,Je,Ye,te,ie,Xe,W,V],styles:[".condition-card[_ngcontent-%COMP%]{padding:1.5rem 1.75rem;display:flex;flex-direction:column;gap:1.25rem}.condition-card__head[_ngcontent-%COMP%]{display:flex;align-items:flex-start;gap:1rem}.condition-card__head[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:1.35rem;margin-bottom:.4rem}.condition-card__head[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0;font-size:.94rem;line-height:1.65}.condition-card__icon[_ngcontent-%COMP%]{width:48px;height:48px;border-radius:14px;background:#e8f7f1;color:#15875f;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0}.condition-accordion[_ngcontent-%COMP%]     .mat-expansion-panel{box-shadow:none!important;border:1px solid var(--border-subtle);border-radius:12px!important;margin-bottom:.5rem;background:var(--bg-subtle);color:var(--ink-primary)}.condition-accordion[_ngcontent-%COMP%]     .mat-expansion-panel-header{font-family:Plus Jakarta Sans,sans-serif;font-weight:600;font-size:.94rem}.condition-accordion[_ngcontent-%COMP%]     .mat-expansion-panel-header-title{color:var(--ink-primary)}.panel-icon[_ngcontent-%COMP%]{margin-right:.55rem;color:var(--accent-primary);font-size:20px;width:20px;height:20px}.panel-icon--warn[_ngcontent-%COMP%]{color:#e53935}.rec-list[_ngcontent-%COMP%]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.55rem}.rec-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{display:flex;align-items:flex-start;gap:.55rem;font-size:.9rem;color:var(--ink-primary);line-height:1.5}.rec-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:18px;width:18px;height:18px;margin-top:2px;flex-shrink:0}.icon-ok[_ngcontent-%COMP%]{color:#20b27f}.icon-warn[_ngcontent-%COMP%]{color:#e53935}.condition-card__footer[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:.75rem;flex-wrap:wrap;padding-top:.75rem;border-top:1px solid #e2ece7}.condition-card__ctas[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.6rem;flex-wrap:wrap;margin-left:auto}@media(max-width:640px){.condition-card[_ngcontent-%COMP%]{padding:1.2rem}.condition-card__ctas[_ngcontent-%COMP%]{width:100%;margin-left:0}.condition-card__ctas[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{flex:1}}"]})};var wn=(t,r)=>r.id;function Mn(t,r){if(t&1&&be(0,"app-medical-condition-card",5),t&2){let e=r.$implicit,n=E();m("condition",e)("expandedByDefault",n.selectedConditionId===e.id)}}function En(t,r){if(t&1){let e=ve();o(0,"div",6)(1,"mat-icon"),s(2,"search_off"),a(),o(3,"h3"),s(4,"Nie znaleziono pasuj\u0105cej jednostki chorobowej"),a(),o(5,"button",7),u("click",function(){se(e);let i=E();return i.searchQuery="",de(i.selectCondition(null))}),s(6," Poka\u017C wszystkie "),a()()}}var en=class t{medicalConditionService=d(je);route=d(Te);router=d(Q);sub=new v;allConditions=[];selectedConditionId=null;searchQuery="";ngOnInit(){this.sub.add(this.medicalConditionService.getMedicalConditions().subscribe(r=>{this.allConditions=r})),this.sub.add(this.route.paramMap.subscribe(r=>{this.selectedConditionId=r.get("id")}))}ngOnDestroy(){this.sub.unsubscribe()}get conditionFilterItems(){return[{value:"",label:"Wszystkie",count:this.allConditions.length},...this.allConditions.map(r=>({value:r.id,label:r.name}))]}get visibleConditions(){let r=this.allConditions;if(this.selectedConditionId){let n=r.find(i=>i.id===this.selectedConditionId);if(n)return[n]}let e=this.searchQuery.trim().toLowerCase();return e&&(r=r.filter(n=>n.name.toLowerCase().includes(e)||n.description.toLowerCase().includes(e))),r}selectCondition(r){r?this.router.navigate(["/choroby",r]):this.router.navigate(["/choroby"])}static \u0275fac=function(e){return new(e||t)};static \u0275cmp=_({type:t,selectors:[["app-conditions"]],decls:8,vars:4,consts:[["title","Choroby dietozale\u017Cne","description","Poznaj najwa\u017Cniejsze jednostki chorobowe i sprawd\u017A oparte na wytycznych NCE\u017B zalecenia \u017Cywieniowe, produkty wskazane i niewskazane oraz pasuj\u0105ce przepisy."],["placeholder","Szukaj choroby...","ariaLabel","Szukaj jednostki chorobowej",1,"header-search",3,"valueChange","value"],[1,"container","conditions-page","fade-in"],[3,"selected","items","activeValue"],[1,"conditions-list"],[3,"condition","expandedByDefault"],[1,"surface-card","empty-box"],["type","button",1,"btn","btn-primary",3,"click"]],template:function(e,n){e&1&&(o(0,"app-presentation-header",0)(1,"app-search-input",1),ke("valueChange",function(p){return Pe(n.searchQuery,p)||(n.searchQuery=p),p}),u("valueChange",function(){return n.selectedConditionId=null}),a()(),o(2,"div",2)(3,"app-filter-strip",3),u("selected",function(p){return n.selectCondition(p||null)}),a(),o(4,"div",4),x(5,Mn,1,2,"app-medical-condition-card",5,wn,!1,En,7,0,"div",6),a()()),e&2&&(l(),Ee("value",n.searchQuery),l(2),m("items",n.conditionFilterItems)("activeValue",n.selectedConditionId||""),l(2),f(n.visibleConditions))},dependencies:[L,ze,W,V,U,Fe,Ie,He],styles:[".header-search[_ngcontent-%COMP%]{width:248px}.conditions-page[_ngcontent-%COMP%]{padding-top:2rem;padding-bottom:3.5rem;display:flex;flex-direction:column;gap:1.5rem}.conditions-list[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:1.25rem}.empty-box[_ngcontent-%COMP%]{padding:3rem 1.5rem;text-align:center;display:flex;flex-direction:column;align-items:center;gap:.75rem}.empty-box[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:46px;width:46px;height:46px;color:var(--ink-muted)}@media(max-width:640px){.header-search[_ngcontent-%COMP%]{width:100%}}"]})};export{en as ConditionsComponent};
