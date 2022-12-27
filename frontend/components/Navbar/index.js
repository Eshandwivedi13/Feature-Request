import React, { useState, useEffect } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  Button,
} from "reactstrap";
import Link from "next/link";
import { signout, isAuth } from "../../api/auth";
import Router from "next/router";
import NProgress from "nprogress";
import { useRouter } from "next/router";

// import "../styles/nprogress.css";
// import "../../node_modules/nprogress/nprogress.css";

import "nprogress/nprogress.css";
import CreatePage from "../Page/CreatePage";
import EditPage from "../Page/EditPage";
import Create from "../Feature/Create";

Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

// Router.events.on("routeChangeStart", nProgress.start);
// Router.events.on("routeChangeError", nProgress.done);
// Router.events.on("routeChangeComplete", nProgress.done);

const Header = ({ singlePage, slug, username }) => {
  const router = useRouter();
  // console.log(router);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
    // if(router.pathname === "/feature/[slug]"){
    //   const showComponent = <CreatePage buttonLabel="Create Page" />
    // }
  }, []);
  if (!hydrated) {
    return null;
  }
  // const showCreateComponent = () => {
  //   console.log("Test");
  //   if (isAuth()) {
  //     if (
  //       router.asPath === `/feature/${slug}` ||
  //       router.asPath === `/pages/${slug}`
  //     ) {
  //       // console.log(singlePage);
  //       return <Create singlePage={singlePage} buttonLabel="Suggest Feature" />;
  //     } else if (router.asPath === `/`) {
  //       return <CreatePage buttonLabel="Create Page" />;
  //     }
  //   } else {
  //     if (
  //       router.asPath === `/feature/${slug}` ||
  //       router.asPath === `/pages/${slug}`
  //     ) {
  //       // console.log(singlePage);
  //       return <Create singlePage={singlePage} buttonLabel="Suggest Feature" />;
  //     } else if (router.asPath === `/`) {
  //       return <CreatePage buttonLabel="Create Page" />;
  //     }
  //   }
  // };

  const showCreateComponent = () => {
    console.log("Test");

    if (
      router.asPath === `/feature/${slug}` ||
      router.asPath === `/pages/${slug}`
    ) {
      // console.log(singlePage);
      return <Create singlePage={singlePage} buttonLabel="Suggest Feature" />;
    } else if (router.asPath === `/`) {
      return <CreatePage buttonLabel="Create Page" />;
    } else if (router.asPath === `/profile/${username}`) {
      return (
        <Button color="primary" size="sm">
          <Link href={`/`}>Home</Link>
        </Button>
      );
    }
    // else if (router.asPath === `/profile/${username}`) {
    //   console.log("slug", slug);
    //   return <EditPage slug={slug} buttonLabel="Edit Page" />;
    // }

    // if (
    //   router.asPath === `/feature/${slug}` ||
    //   router.asPath === `/pages/${slug}`
    // ) {
    //   // console.log(singlePage);
    //   return <Create singlePage={singlePage} buttonLabel="Suggest Feature" />;
    // } else if (router.asPath === `/`) {
    //   return <CreatePage buttonLabel="Create Page" />;
    // }
  };
  return (
    <React.Fragment>
      <div>
        <Navbar color="light" light expand="md">
          <Nav className="mr-auto" navbar>
            {/* <NavItem>
              <Link href="/feature/getFeatures">
                <NavLink>Requests</NavLink>
              </Link>
            </NavItem> */}
            {/* {isAuth() && (
              <NavItem className="my-auto">
                {showCreateComponent()}      
              </NavItem>
            )} */}
            {
              <NavItem className="my-auto">
                {/* <CreatePage buttonLabel="Create Page" /> */}
                {showCreateComponent()}
                {/* <Button className="btn-primary" onClick={handleClick}>
                Create
              </Button> */}
              </NavItem>
            }
          </Nav>

          <Nav>
            {!isAuth() ? (
              <React.Fragment>
                <NavItem>
                  <Link href="/signin">
                    <NavLink style={{ cursor: "pointer" }}>Signin</NavLink>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/signup">
                    <NavLink style={{ cursor: "pointer" }}>Signup</NavLink>
                  </Link>
                </NavItem>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <NavItem className="my-auto">
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => signout(() => router.push("/signin"))}
                  >
                    Signout
                  </Button>
                </NavItem>

                <NavItem>
                  <Link legacyBehavious href={`/profile/${isAuth().username}`}>
                    <NavLink
                    // tag="a"
                    // className="white-link"
                    >
                      {`${isAuth().username}'s profile `}
                    </NavLink>
                  </Link>
                </NavItem>
              </React.Fragment>
            )}
          </Nav>
        </Navbar>
      </div>
    </React.Fragment>
  );
};

export default Header;
