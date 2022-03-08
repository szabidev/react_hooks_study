import React from "react";

const Link = ({ className, href, children }) => {
  const onClick = (event) => {
    // open in new tab
    if (event.metaKey || event.ctrlKey) {
      return;
    }

    event.preventDefault();
    // Change url but dont refresh page
    window.history.pushState({}, "", href);
    // this will communicate to the components that the url has changed
    const navEvent = new PopStateEvent("popstate");
    window.dispatchEvent(navEvent);
  };

  return (
    <a onClick={onClick} className={className} href={href}>
      {children}
    </a>
  );
};

export default Link;
