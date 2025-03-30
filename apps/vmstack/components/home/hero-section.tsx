"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Globe, Lock, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { ButtonLink } from "../ui"

export default function HeroSection() {
  const session = useSession()
  const isAuthenticated = session?.status === "authenticated"
  const { theme } = useTheme()
  const [activeVm, setActiveVm] = useState<number>(0)

  const vmConfigs = [
    { name: "AVM", color: "#fc92cb", label: "Algorand" },
    { name: "Substrate", color: "#dd3ce2", label: "Substrate" },
    { name: "EVM", color: "#b91cbf", label: "Ethereum" },
    { name: "SVM", color: "#dd3ce2", label: "Solana" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVm((prev) => (prev + 1) % vmConfigs.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative overflow-hidden w-full pb-16 md:pb-24 pt-32 md:pt-40 bg-background border-b mt-[-64px]">
      {/* Background grid effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full grid grid-cols-12 grid-rows-6">
          {Array.from({ length: 72 }).map((_, i) => (
            <div key={i} className="border border-muted" />
          ))}
        </div>
      </div>

      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: `radial-gradient(circle at 50% 30%, ${vmConfigs[activeVm].color}40, transparent 70%)`,
        }}
        transition={{ duration: 1.5 }}
      />

      <div className="container px-4 md:px-6 relative z-10 mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-12">
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center mb-8"
          >
            <div className="mb-6 transform scale-150">
              <svg
                id="Layer_1"
                height="48"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary"
                viewBox="0 0 411.6306 103.2482"
              >
                <defs>
                  <linearGradient
                    id="linear-gradient"
                    x1="50.80845"
                    y1="29.98637"
                    x2="88.49846"
                    y2="29.98637"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stopColor="#fc92cb"></stop>
                    <stop offset=".51" stopColor="#dd3ce2"></stop>
                    <stop offset="1" stopColor="#b91cbf"></stop>
                  </linearGradient>
                </defs>
                <rect
                  id="_Transparent_Rectangle_"
                  width="103.2482"
                  height="103.2482"
                  fill="none"
                  strokeWidth="0"
                ></rect>
                <path
                  d="M127.9141,78.00151l-17.85021-52.07783h13.71985l10.69861,39.09618,10.76702-39.09618h13.64783l-17.77819,52.07783h-13.20491Z"
                  fill="currentColor"
                  strokeWidth="0"
                ></path>
                <path
                  d="M173.56413,31.23517h-.51494l1.40079,46.76634h-11.50883V25.92368h18.00146l10.17646,40.9399,10.10804-40.9399h17.99786v52.07783h-11.50883l1.47641-46.76634h-.51494l-11.87614,46.76634h-11.43321l-11.80412-46.76634Z"
                  fill="currentColor"
                  strokeWidth="0"
                ></path>
                <path
                  d="M244.36361,70.77248c3.76306,0,5.90206-1.47461,5.90206-3.68744,0-1.10731-.95787-2.43428-2.28664-2.87721-2.43428-.88585-5.6788-1.03349-9.14657-2.06518-7.37847-2.139-10.695-4.94239-10.695-10.54916,0-8.33454,6.12172-13.64603,16.59706-13.64603,5.89846,0,11.06231,1.7699,15.56357,5.45913l-6.34498,6.85993c-3.17249-2.65575-6.56464-4.05834-10.03242-4.05834-2.87721,0-4.57328,1.47641-4.57328,3.46777,0,2.72957,2.72957,2.95103,8.04106,4.20418,9.73714,2.28664,14.31042,4.278,14.31042,11.87614,0,8.04106-6.78431,13.57221-18.22112,13.57221-8.48038,0-14.45446-2.80159-17.70257-8.11308l6.85993-5.97588c3.17249,3.76306,7.00757,5.53295,11.72849,5.53295Z"
                  fill="currentColor"
                  strokeWidth="0"
                ></path>
                <path
                  d="M284.70575,69.44551c.59057,0,1.62406-.07382,3.02485-.22146v8.77747c-2.5063.51675-4.79655.73821-6.93555.73821-9.58949,0-11.06231-4.20598-11.06231-14.75334v-16.7447h-5.60677v-7.00757h5.60677v-12.0976h11.28557v12.0976h6.71229v7.00757h-6.71229v17.18763c0,3.76126.59057,5.01621,3.68744,5.01621Z"
                  fill="currentColor"
                  strokeWidth="0"
                ></path>
                <path
                  d="M304.32046,79.25466c-7.8214,0-12.68636-4.72093-12.68636-11.50703,0-5.38351,2.94923-9.51567,8.1851-11.58085,3.98272-1.54843,9.22219-2.28664,15.49155-3.68744v-1.69608c0-3.76306-1.47641-5.38531-5.38351-5.38531-3.83868,0-5.6824,1.54843-5.75442,4.94239h-10.99029v-.14764c0-7.67196,6.0461-12.17142,16.89235-12.17142,12.02378,0,16.52144,3.9089,16.52144,13.35075v.44292l-.21966,17.63055v1.69608c0,3.32013.21966,5.60677,1.10551,6.85993h-10.695c-.3709-1.03349-.59057-2.28664-.59057-3.68744v-.59057c-2.95283,3.76126-6.85993,5.53115-11.87614,5.53115ZM302.10583,66.86358c0,2.65575,1.84372,4.35182,4.94419,4.35182,5.08823,0,8.26072-3.46777,8.26072-9.51567v-2.21282c-9.07455,2.28664-13.20491,2.87721-13.20491,7.37667Z"
                  fill="currentColor"
                  strokeWidth="0"
                ></path>
                <path
                  d="M351.51891,79.32848c-11.65287,0-19.10337-7.74398-19.10337-20.13686,0-13.05547,7.8178-21.17035,20.20888-21.17035,7.37847,0,12.54232,3.02485,16.0065,9.29421l-8.33274,4.86857c-1.62406-3.39395-4.05834-5.09003-7.45049-5.09003-5.53475,0-8.99893,4.278-8.99893,11.58085,0,7.22903,3.46417,11.58085,8.556,11.58085,3.9107,0,6.56464-1.99136,8.1887-5.90026l8.33274,4.57328c-3.68744,6.71229-9.80916,10.39972-17.40729,10.39972Z"
                  fill="currentColor"
                  strokeWidth="0"
                ></path>
                <path
                  d="M373.42027,25.92368h11.06231v28.10409l13.05727-14.75334h12.53872l-13.34895,13.64783,14.90099,25.07924h-13.20491l-9.66511-16.81852-4.278,4.278v12.54052h-11.06231V25.92368Z"
                  fill="currentColor"
                  strokeWidth="0"
                ></path>
                <path
                  d="M13.14204,11.72737c-3.18186-.00326-5.7639,2.57351-5.76716,5.75537,0,.00197,0,.00393,0,.0059v24.48391c0,3.18432,2.58284,5.76127,5.76716,5.76127h24.4898c3.18432,0,5.76127-2.57694,5.76127-5.76127v-24.48391c.00326-3.18186-2.57351-5.7639-5.75537-5.76716-.00197,0-.00393,0-.0059,0l-24.4898,.0059ZM7.37487,62.26376c0-3.18432,2.58284-5.76127,5.76716-5.76127h24.4898c3.18432,0,5.76127,2.57694,5.76127,5.76127v24.4898c0,3.18432-2.57694,5.76716-5.76127,5.76716H13.14204c-3.18186.00326-5.7639-2.5735-5.76716-5.75536,0-.00393,0-.00787,0-.0118v-24.4898ZM52.16179,62.26376c0-3.18432,2.57694-5.76127,5.76127-5.76127h24.4898c3.18432,0,5.76716,2.57694,5.76716,5.76127v24.4898c0,3.18432-2.58284,5.76716-5.76716,5.76716h-24.4839c-3.18186,0-5.76127-2.5794-5.76127-5.76126,0-.00197,0-.00393,0-.0059v-24.4839l-.0059-.0059Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  strokeWidth="0"
                ></path>
                <path
                  d="M65.11727,15.02963c1.04965-4.81187,7.90184-4.84135,9.00456-.04128l.04718.22408.10025.42458c1.19316,5.08876,5.31121,8.97235,10.46109,9.86551,5.02416.87864,5.02416,8.09054,0,8.96328-5.18199.89677-9.31715,4.82029-10.48468,9.94806l-.12383.5661c-1.09682,4.80597-7.95491,4.77648-9.00456-.04128l-.11205-.48354c-1.12955-5.14051-5.25293-9.08917-10.43751-9.99524-5.01236-.87274-5.01236-8.07875,0-8.94559,5.169-.90137,9.28611-4.82763,10.43161-9.94806l.07666-.35381.04128-.17691v-.0059Z"
                  fill="url(#linear-gradient)"
                  fillRule="evenodd"
                  strokeWidth="0"
                ></path>
              </svg>
            </div>

            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
              Universal VM Authentication
            </h1>

            <div className="relative h-12 mb-4">
              <motion.div
                key={activeVm}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex justify-center"
              >
                <div
                  className="text-xl md:text-2xl font-medium px-4 py-1 rounded-full whitespace-nowrap flex items-center "
                  style={{
                    background: `linear-gradient(to right, ${vmConfigs[activeVm].color}20, ${vmConfigs[activeVm].color}40)`,
                    color: vmConfigs[activeVm].color,
                  }}
                >
                  {vmConfigs[activeVm].label} VM
                </div>
              </motion.div>
            </div>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Seamlessly connect and authenticate across multiple virtual machine ecosystems with VMStack&apos;s unified
              interface.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {!isAuthenticated ? (
              <>
                <ButtonLink
                 href="#connect"
                  className="gap-2 group"
                  style={{
                    background: "linear-gradient(to right, #fc92cb, #dd3ce2, #b91cbf)",
                    color: "white",
                  }}
                >
                  Connect Your Wallet
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </ButtonLink>
                <Button size="lg" variant="outline">
                  Explore VMStack
                </Button>
              </>
            ) : (
              <Link href="#connect">
                <Button
                  size="lg"
                  className="gap-2 group"
                  style={{
                    background: "linear-gradient(to right, #fc92cb, #dd3ce2, #b91cbf)",
                    color: "white",
                  }}
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            )}
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-[#fc92cb]/30">
            <div className="flex flex-col space-y-4">
              <div className="p-2 w-fit rounded-full" style={{ background: "#fc92cb20" }}>
                <Globe className="h-6 w-6" style={{ color: "#fc92cb" }} />
              </div>
              <h3 className="text-xl font-semibold">Cross-VM Compatibility</h3>
              <p className="text-muted-foreground">
                Connect to Algorand, Ethereum, Solana, and Polkadot ecosystems through a single unified interface.
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-[#dd3ce2]/30">
            <div className="flex flex-col space-y-4">
              <div className="p-2 w-fit rounded-full" style={{ background: "#dd3ce220" }}>
                <Lock className="h-6 w-6" style={{ color: "#dd3ce2" }} />
              </div>
              <h3 className="text-xl font-semibold">Secure Authentication</h3>
              <p className="text-muted-foreground">
                Industry-standard wallet-based sign-in protocols with VMStack&apos;s enhanced security measures.
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-[#b91cbf]/30">
            <div className="flex flex-col space-y-4">
              <div className="p-2 w-fit rounded-full" style={{ background: "#b91cbf20" }}>
                <Shield className="h-6 w-6" style={{ color: "#b91cbf" }} />
              </div>
              <h3 className="text-xl font-semibold">Wallet Integration</h3>
              <p className="text-muted-foreground">
                Supports popular wallets like Pera, Talisman, MetaMask, and Phantom with more coming soon.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

