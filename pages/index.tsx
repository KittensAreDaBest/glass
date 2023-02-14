/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import { useRef, useState, Fragment, use, useEffect } from 'react'
import axios from 'axios'
import { Dialog, Transition } from '@headlessui/react'
import locations from '@/config/locations.json'
export default function Home() {
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState("")
  const [validation, setValidation] = useState("")

  const inputRef = useRef<HTMLInputElement>(null)
  const selectRef = useRef<HTMLSelectElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const types = [
    {
      name: "Ping",
      value: "ping",
      supported: ["ipv4", "ipv6", "domain"]
    },
    {
      name: "MTR",
      value: "mtr",
      supported: ["ipv4", "ipv6", "domain"]
    },
    {
      name: "Traceroute",
      value: "traceroute",
      supported: ["ipv4", "ipv6", "domain"]
    },
  ]

  const [domain, setDomain] = useState("")
  const [ipv4, setIpv4] = useState<string[]>([])
  const [ipv6, setIpv6] = useState<string[]>([])
  const [dnsLoading, setDnsLoading] = useState(false)
  const [ipModel, setIpModel] = useState(false)
  if (process.env.NEXT_PUBLIC_BGP_ENABLED == "true") {
    types.push({
      name: "BGP Route Dump",
      value: "bgp",
      supported: ["ipv4", "ipv6"]
    })
  }
  return (
    <>
      <Head>
        <title>{`${process.env.NEXT_PUBLIC_COMPANY} - Looking Glass`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Transition appear show={ipModel} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => { setIpModel(false) }}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-md bg-zinc-900 border-[#212528] border-2 p-3 text-left align-middle shadow-xl transition-all">
                  <div className='flex flex-row justify-between items-center'>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-white"
                    >
                      <span className='text-blue-500 font-semibold'>{domain}</span> has been resolved to
                    </Dialog.Title>
                    <button
                      className='px-2 py-1 transition-all duration-200 rounded-md hover:bg-zinc-800'
                      onClick={() => { setIpModel(false) }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>

                    </button>
                  </div>
                  <div className="mt-2 flex flex-col gap-2">
                    {dnsLoading ?
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" className='animate-spin h-5 w-6' viewBox="0 0 16 16">
                        <path fill="#FFFFFF" d="M8 16c-2.137 0-4.146-0.832-5.657-2.343s-2.343-3.52-2.343-5.657c0-1.513 0.425-2.986 1.228-4.261 0.781-1.239 1.885-2.24 3.193-2.895l0.672 1.341c-1.063 0.533-1.961 1.347-2.596 2.354-0.652 1.034-0.997 2.231-0.997 3.461 0 3.584 2.916 6.5 6.5 6.5s6.5-2.916 6.5-6.5c0-1.23-0.345-2.426-0.997-3.461-0.635-1.008-1.533-1.822-2.596-2.354l0.672-1.341c1.308 0.655 2.412 1.656 3.193 2.895 0.803 1.274 1.228 2.748 1.228 4.261 0 2.137-0.832 4.146-2.343 5.657s-3.52 2.343-5.657 2.343z"></path>
                      </svg>
                      :
                      <>
                        {ipv4.map((ip, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              if (inputRef.current) {
                                inputRef.current.value = ip
                              }
                              if (buttonRef.current) {
                                buttonRef.current.click()
                              }
                              setIpModel(false)
                            }}
                            className='bg-sky-500 hover:bg-sky-600 border-2 border-sky-400 transition-all duration-200 p-1 px-3 text-xs rounded w-full term inline-flex items-center justify-between'
                          >
                            <span>{ip}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3 h-3 text-white">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                          </button>
                        ))}
                        {ipv6.map((ip, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              if (inputRef.current) {
                                inputRef.current.value = ip
                              }
                              if (buttonRef.current) {
                                buttonRef.current.click()
                              }
                              setIpModel(false)
                            }}
                            className='bg-cyan-500 hover:bg-cyan-600 border-2 border-cyan-400 transition-all duration-200 p-1 px-3 text-xs rounded w-full term inline-flex items-center justify-between'
                          >
                            <span>{ip}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3 h-3 text-white">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                          </button>
                        ))}
                        {ipv4.length === 0 && ipv6.length === 0 && (
                          <button onClick={() => {
                            setIpModel(false)
                          }} className='bg-red-500 hover:bg-red-600 border-2 border-red-400 transition-all duration-200 p-1 px-3 text-xs rounded w-full term inline-flex items-center justify-between'>
                            <span>No A or AAAA records detected</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3 h-3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </>
                    }
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <div className='container mx-auto gap-4 px-4 md:px-0 flex flex-col'>
        <div className='py-4 flex md:flex-row flex-col items-center md:justify-between gap-4 w-full justify-center border-[#1C2026] border-b-2'>
          <img src={process.env.NEXT_PUBLIC_COMPANY_LOGO} alt={`logo of ${process.env.NEXT_PUBLIC_COMPANY}`} className='h-12' />
          <div className='w-full md:w-auto'>
            {locations.length > 1 && (
              <select
                className={`w-full md:w-auto bg-transparent px-4 py-2 rounded-md border-zinc-700 ${loading ? 'cursor-not-allowed' : 'hover:bg-zinc-800'} transition-all duration-200 ring-0 outline-none border-2 text-white`}
                onChange={(e) => {
                  if (e.target.value) {
                    window.location.href = e.target.value
                  }
                }}
              >
                {locations.map((location, i) => (
                  <option className='bg-zinc-800' key={i} value={location.link} selected={location.location == process.env.NEXT_PUBLIC_LOCATION}>{location.location}</option>
                ))}
              </select>
            )}
          </div>
        </div>
        <div className='bg-[#1C2023] border-[#212528] divide-y-2 md:divide-x-2 divide-[#212528] border-2 rounded-md grid md:grid-cols-2'>
          <div className='flex flex-col p-3'>
            <code>{process.env.NEXT_PUBLIC_IPV4?.length === 0 ? "Not set" : process.env.NEXT_PUBLIC_IPV4}</code>
            <span className='text-xs text-[#919296] font-black tracking-wider'>TEST IPV4</span>
          </div>
          <div className='flex flex-col p-3'>
            <code>{process.env.NEXT_PUBLIC_IPV6?.length === 0 ? "Not set" : process.env.NEXT_PUBLIC_IPV6}</code>
            <span className='text-xs text-[#919296] font-black tracking-wider'>TEST IPV6</span>
          </div>
          <div className='flex flex-col p-3 md:border-t-2 md:border-[#212528]'>
            <code>{process.env.NEXT_PUBLIC_LOCATION?.length === 0 ? "Not set" : process.env.NEXT_PUBLIC_LOCATION}</code>
            <span className='text-xs text-[#919296] font-black tracking-wider'>LOCATION</span>
          </div>
          <div className='flex flex-col p-3 md:border-t-2 md:border-[#212528]'>
            <code>{process.env.NEXT_PUBLIC_DATACENTER?.length === 0 ? "Not set" : process.env.NEXT_PUBLIC_DATACENTER}</code>
            <span className='text-xs text-[#919296] font-black tracking-wider'>DATACENTER</span>
          </div>
        </div>
        {process.env.NEXT_PUBLIC_FILES_ENABLED === "true" && (
          <div className='bg-[#1C2023] border-[#212528] p-3 flex flex-col border-2 rounded-md gap-4'>
            <span className='text-2xl'>Test Files</span>
            <div className='flex flex-col gap-4 md:flex-row'>
              <a href="/files/100M.file" className='py-1.5 px-6 w-full bg-indigo-500 hover:bg-indigo-600 border-2 border-indigo-400 transition-all duration-200 rounded-md text-center'>
                100M Test File
              </a>
              <a href="/files/1G.file" className='py-1.5 px-6 w-full bg-violet-500 hover:bg-violet-600 border-2 border-violet-400 transition-all duration-200 rounded-md text-center'>
                1GB Test File
              </a>
              <a href="/files/5G.file" className='py-1.5 px-6 w-full bg-purple-500 hover:bg-purple-600 border-2 border-purple-400 transition-all duration-200 rounded-md text-center'>
                5GB Test File
              </a>
              <a href="/files/10G.file" className='py-1.5 px-6 w-full bg-teal-500 hover:bg-teal-600 border-2 border-teal-400 transition-all duration-200 rounded-md text-center'>
                10GB Test File
              </a>
            </div>
          </div>
        )}
        <div className='bg-[#1C2023] border-[#212528] p-3 flex flex-col border-2 rounded-md gap-4'>
          <span className='text-2xl'>Looking Glass</span>
          <div className='flex flex-col gap-4 md:gap-0 md:flex-row md:items-stretch'>
            <input
              className={`rounded-l-md w-full bg-transparent px-3 py-2 border-zinc-700 ${loading ? 'cursor-not-allowed' : 'hover:bg-zinc-800'} transition-all duration-200 ring-0 outline-none border-2 text-white`}
              placeholder='Enter a ip address or domain...'
              disabled={loading}
              ref={inputRef}
            />
            <select
              className={`bg-transparent px-4 py-2 rounded-md md:rounded-none border-zinc-700 ${loading ? 'cursor-not-allowed' : 'hover:bg-zinc-800'} transition-all duration-200 ring-0 outline-none border-2 text-white`}
              disabled={loading}
              ref={selectRef}
            >
              {types.map((type, index) => (
                <option className='bg-zinc-800' value={type.value} key={index}>{type.name}</option>
              ))}
            </select>
            <button
              ref={buttonRef}
              onClick={() => {
                setOutput("")
                if (inputRef.current) {
                  if (inputRef.current.value.length === 0) {
                    setValidation("Please enter a ip address or domain")
                    return
                  }
                };
                let type = ""
                if (inputRef.current?.value.trim().toLowerCase().match(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))?$/gm)) {
                  type = "ipv4"
                }
                if (inputRef.current?.value.trim().toLowerCase().match(/^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))(\/([0-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8]))?$/gm)) {
                  type = "ipv6"
                }
                if (inputRef.current?.value.trim().toLowerCase().match(/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/)) {
                  type = "domain"
                }
                const method = types.find(t => t.value === selectRef.current?.value)
                if (method) {
                  if (type === "") {
                    setValidation(`Please enter a valid ${method.supported.join(" or ")}`)
                    return
                  }
                  if (!method.supported.includes(type)) {
                    if (type === "domain") {
                      setDnsLoading(true)
                      setDomain(inputRef.current?.value ? inputRef.current?.value.trim().toLowerCase() : "")
                      setIpv4([])
                      setIpv6([])
                      axios.get(`https://cloudflare-dns.com/dns-query?name=${inputRef.current?.value.trim().toLowerCase()}&type=A`, {
                        headers: {
                          accept: "application/dns-json"
                        }
                      }).then(res => {
                        if (res.data.Answer) {
                          res.data.Answer.forEach((a: any) => {
                            setIpv4(ipv4 => [...ipv4, a.data])
                          })
                        }
                      }).finally(() => {
                        axios.get(`https://cloudflare-dns.com/dns-query?name=${inputRef.current?.value.trim().toLowerCase()}&type=AAAA`, {
                          headers: {
                            accept: "application/dns-json"
                          }
                        }).then(res => {
                          if (res.data.Answer) {
                            res.data.Answer.forEach((a: any) => {
                              setIpv6(ipv6 => [...ipv6, a.data])
                            })
                          }
                        }).finally(() => {
                          console.log(ipv4)
                          setDnsLoading(false)
                        })
                      })
                      setIpModel(true)
                      return
                    }
                    setValidation(`${method.name} does not support ${type}`)
                    return
                  }
                }
                setValidation("")
                setLoading(true)
                axios.post("/api/lg", {
                  target: inputRef.current?.value.trim().toLowerCase(),
                  type: selectRef.current?.value
                }).then(res => {
                  console.log(res.data)
                  setValidation("")
                  setLoading(false)
                  setOutput(res.data.data)
                }).catch(err => {
                  console.log(err)
                  setValidation("An error occurred while processing the request")
                  setLoading(false)
                })

              }
              }
              className='px-6 py-2 flex flex-row items-center justify-center whitespace-nowrap bg-fuchsia-500 hover:bg-fuchsia-600 border-fuchsia-400 border-2 transition-all duration-200 md:rounded-l-none rounded-md'
            >
              {loading ?
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" className='animate-spin h-5 w-6' viewBox="0 0 16 16">
                  <path fill="#FFFFFF" d="M8 16c-2.137 0-4.146-0.832-5.657-2.343s-2.343-3.52-2.343-5.657c0-1.513 0.425-2.986 1.228-4.261 0.781-1.239 1.885-2.24 3.193-2.895l0.672 1.341c-1.063 0.533-1.961 1.347-2.596 2.354-0.652 1.034-0.997 2.231-0.997 3.461 0 3.584 2.916 6.5 6.5 6.5s6.5-2.916 6.5-6.5c0-1.23-0.345-2.426-0.997-3.461-0.635-1.008-1.533-1.822-2.596-2.354l0.672-1.341c1.308 0.655 2.412 1.656 3.193 2.895 0.803 1.274 1.228 2.748 1.228 4.261 0 2.137-0.832 4.146-2.343 5.657s-3.52 2.343-5.657 2.343z"></path>
                </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              }
            </button>
          </div>
          {validation && (
            <div className='flex items-center border-l-[6px] rounded-md border-red-500 bg-red-500/25 p-3'>
              <span className='text-red-500 mr-1 font-semibold'>error:</span><span>{validation}</span>
            </div>
          )}
          {output && (
            <div className='p-3 rounded-md bg-black term overflow-auto'>
              {output.split("\n").map((line, i) => (
                <>
                  {line === "" ? <br /> : <pre key={i}>{line}</pre>}
                </>
              ))}
            </div>
          )}
        </div>
        <div className='py-4 flex flex-row items-center w-full justify-between gap-4 border-[#1C2026] border-t-2'>
          <a href="https://github.com/kittensaredabest/glass" target={"_blank"} rel="noreferrer">
            <span className='inline-flex flex-row items-center gap-2 font-semibold'>Powered by <span className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-black tracking-widest uppercase text-2xl'>Glass</span></span>
          </a>
          <a href="https://github.com/kittensaredabest/glass" target={"_blank"} rel="noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" className='h-6' fill='#FFFFFF'>
              <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
            </svg>
          </a>
        </div>
      </div>
    </>
  )
}
