import { Title } from "@mantine/core";
import { useAppContext } from "context/app.context";
import { Link } from "react-router-dom";

const SITE_LINKS = [
  { title: "INTERACTIVE", url: "/interactive" },
  { title: "VIDEO FILTER", url: "/video-filter" },
];

export const NavBar = () => {
  const {
    state: { isViewFullScreen },
  } = useAppContext();
  const links = SITE_LINKS.map((link) => (
    <Link
      className="link"
      // data-active={activeLink === link.url || undefined}
      to={link.url}
      key={link.url}
    >
      {link.title}
    </Link>
  ));

  if (isViewFullScreen) {
    return null;
  }
  return (
    <nav className="navbar">
      <div className="wrapper">
        <div className="main">
          <Title order={4}>{"ART OS"}</Title>
          {links}
        </div>
      </div>
    </nav>
  );
};
