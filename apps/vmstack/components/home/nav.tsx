"use client";

import {
  useParams,
  usePathname,
  useSelectedLayoutSegment,
} from "next/navigation";
import { useSession } from "next-auth/react";
import { Suspense, useContext, useState } from "react";
import Link from "next/link";
import { GlobalModalContext } from "@/providers/global-modal-provider";
import { cn } from "@/lib/utils";
import MaxWidthWrapperV2 from "../ui/layout/max-width-wrapper-v2";
import { HOME_DOMAIN } from "@/lib/constants";
import { Button, ButtonLink } from "../ui";
import useScroll from "@/lib/hooks/use-scroll";
import VMStackLogoType from "@/icons/brand-icons/vmstack-logo";

export const navItems = [
  {
    name: "Contact",
    slug: "#",
  },
  {
    name: "Changelog",
    slug: "#",
  },
  {
    name: "Blog",
    slug: "#",
  },
  {
    name: "Help",
    slug: "#",
  },
];

export default function Nav({
  location,
  page,
}: {
  location: "home";
  page?: "login" | "register";
}) {
  const { domain = "vmkit.xyz" } = useParams() as { domain: string };
  const scrolled = useScroll(80);
  const selectedLayout = useSelectedLayoutSegment();
  const helpCenter = selectedLayout === "help";
  const guideCenter = selectedLayout === "guides";
  const rustCenter = selectedLayout === "rust";

  const pathname = usePathname();

  const { data: session, status } = useSession() || {
    status: "unauthenticated", // if `useSession` is undefined, we're on a non vmkit.xyz domain
  };
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { showLoginModal, setShowLoginModal } = useContext(GlobalModalContext);

  const isHome = location === "home";

  // rust-nav = nav w/ border
  // rust-mobile-bg = nav config for open mobile menu
  // if rust-nav befor scrolled = nav w/ border

  const scrollBorderNav = scrolled;

  const navClasses = cn("rust-nav-pre ", {
    "rust-mobile-bg": showMobileMenu,
    "bg-transparent header_noBorder": isHome,
    "rust-nav rust-nav-primary-bg": scrollBorderNav,
    "rust-nav-alt-scrolled":
      scrolled && (selectedLayout === "chains"),
  });

  // If we're on rust design layout, we don't want to show the main nav
  if (rustCenter) {
    return null;
  }

  return (
    <>
      <div className={navClasses}>
        <MaxWidthWrapperV2
          className="rust-nav-l1 flex w-full max-w-screen-xlview items-center justify-between"
          {...(helpCenter && {
            className:
              "rust-nav-l1 flex items-center justify-between mx-auto w-full max-w-screen-xl px-4 lg:px-6",
          })}
        >
          <div className="rust-nav-l2 flex h-14 w-full items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                prefetch={false}
                href={`${HOME_DOMAIN}/`}
              >
                <VMStackLogoType className="text-primary" />
              </Link>
              <div className="hidden items-center lg:flex">
                {/* Only show these links if the user is an admin */}
                {navItems.map(({ name, slug }) => (
                  <Link
                    id={`nav-${slug}`}
                    key={name}
                    href={`${HOME_DOMAIN}/${slug}`}

                    className={cn(
                      "rust-navlink z-10 transition-colors ease-out hover:text-foreground",
                      {
                        "rust-navlink-active": selectedLayout === slug,
                      },
                    )}
                  >
                    {name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex">
              {session ? (
                <></>
              ) : status === "unauthenticated" ? (
                <>
                  <>
                    <div className="flex items-center gap-2">
                      <ButtonLink
                        skinny
                        variant="link"
                        href="#"
                      >
                        Contact
                      </ButtonLink>
                      <Button
                        skinny
                        variant="outline"
                        onClick={() => {
                          setShowLoginModal(true);
                        }}
                      >
                        Log in
                      </Button>
                    </div>
                    <Button
                      skinny
                      className="ml-2"
                      variant="primary"
                      onClick={() => {
                        setShowLoginModal(true);
                      }}
                    >
                      Sign up
                    </Button>
                  </>

                </>
              ) : null}
            </div>
            {session ? (
              <div className="flex items-center lg:gap-3">
                <ButtonLink
                  href={HOME_DOMAIN}
                  variant="outline"
                  slim
                  className="hidden lg:flex"
                >
                  Home
                </ButtonLink>

              </div>
            ) : (
              <div className="flex lg:hidden">
                <Suspense fallback={null}>

                </Suspense>
              </div>
            )}
          </div>
        </MaxWidthWrapperV2>
      </div>
    </>
  );
}
