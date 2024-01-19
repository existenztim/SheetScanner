'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';
const AboutApp = () => {
  return (
    <>
          <div
        className='sheetscanner-fadein flex flex-col justify-center items-center bg-slate-50 mt-[-3rem]'
      >
        <section className="flex flex-wrap mt-6 px-2 pb-4 min-h-screen  bg-slate-100 rounded-t-xl">
          <div className="flex items-center w-full lg:w-1/2">
            <div className="max-w-2xl mb-8">
              <h1 className="text-4xl font-bold leading-snug tracking-tight text-green-900 lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight">
                Welcome to SheetScanner!
              </h1>
              <p className="py-5 text-xl leading-normal text-gray-500 lg:text-xl xl:text-2x">
                &quot;SheetScanner is a powerful and versatile web application designed to simplify the way you work
                with Excel documents. With SheetScanner, you can effortlessly search through your uploaded Excel files,
                making data retrieval a breeze.<br></br>
                <br></br> Whether you&apos;re a professional handling complex spreadsheets or a casual user looking for
                a specific piece of information, SheetScanner has got you covered.&quot;
              </p>

              <div className="flex flex-row items-center flex-wrap gap-2 justify-center">
                <Link className="bg-green-700 rounded" href='/scanner/guest'>
                  Check it out!
                </Link>
                <a className="bg-yellow-600 text-gray-800 hover:text-gray-50 rounded" href="#how">
                  Tell me how it works
                </a>

                <a
                  href="https://github.com/existenztim/SheetScanner"
                  target="_blank"
                  rel="noopener"
                  className="flex rounded-md items-center space-x-2 text-gray-800 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    View on Github <FaGithub />
                  </span>
                </a>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center w-full lg:w-1/2">
            <div className="">
              <Image
                src="/images/excels.png"
                width="616"
                height="617"
                className={'object-cover'}
                alt="Hero Illustration"
                loading="eager"
              />
              <a
                className="rounded text-gray-800 hover:text-white text-sm"
                href="https://www.freepik.com/free-vector/mental-health-wellness-composition-workplace-icons-with-human-character-worker-with-reactions-chat-bubbles-vector-illustration_38753728.htm#query=flat%20design%20excel&position=5&from_view=search&track=ais&uuid=f991704e-4e03-4555-83d8-3788de19a847"
                target="_blank"
                rel="noopener noreferrer"
              >
                Image by macrovector on Freepik
              </a>
            </div>
          </div>
        </section>

        <section id="how" className="flex flex-wrap px-2 min-h-screen bg-green-100 pb-4">
          <div className="flex items-center justify-center w-full lg:w-1/2">
            <div className="relative group">
              <Image
                src="/images/how.png"
                width="616"
                height="617"
                className={'object-cover'}
                alt="Hero Illustration"
                loading="eager"
              />
              <a
                className="absolute bottom-16 right-24 rounded text-gray-800 hover:text-white text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                href="https://www.freepik.com/free-vector/mental-health-wellness-composition-workplace-icons-with-human-character-worker-with-reactions-chat-bubbles-vector-illustration_38753728.htm#query=flat%20design%20excel&position=5&from_view=search&track=ais&uuid=f991704e-4e03-4555-83d8-3788de19a847"
                target="_blank"
                rel="noopener noreferrer"
              >
                Image by macrovector on Freepik
              </a>
            </div>
          </div>
          <div className="flex items-center w-full lg:w-1/2">
            <div className="max-w-2xl mb-8">
              <h2 className="text-3xl font-bold leading-snug tracking-tight text-green-900 lg:text-3xl lg:leading-tight xl:text-5xl xl:leading-tight">
                How SheetScanner Works
              </h2>
              <p className="py-5 text-xl leading-normal text-gray-500 lg:text-xl xl:text-2x">
                &quot;SheetScanner operates on a simple yet effective principle: it empowers you to search through Excel
                documents that you upload, saving you valuable time and effort. Our intuitive interface allows you to
                browse and search your uploaded Excel files with ease.<br></br>
                <br></br> Additionally, you can directly click on objects within the sheets, copying them to your
                clipboard for quick access. SheetScanner is not only a search tool but also a versatile form where you
                can input data, create notes, and streamline your workflow.&quot;
              </p>

              <div className="flex flex-row items-center flex-wrap gap-2 justify-center">
                <Link className="bg-green-700 rounded" href='/scanner/guest'>
                  Check it out!
                </Link>
                <a href="#faq" className="bg-yellow-600 text-gray-800 hover:text-gray-50 rounded">
                  Common questions
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="flex flex-wrap px-2 min-h-screen pb-4 bg-green-200">
          <div className="flex items-center w-full lg:w-1/2">
            <div className="max-w-2xl mb-8  w-full">
              <h2 className="text-3xl font-bold leading-snug tracking-tight text-green-900 lg:text-3xl lg:leading-tight xl:text-5xl xl:leading-tight">
                Do you have questions about SheetScanner?
              </h2>
              <h3 className="text-lg font-semibold text-gray-600 mt-4">
                We&apos;ve got answers! Here are some common queries and their solutions:
              </h3>

              <div className="text-gray-600 my-4 flex flex-col items-start gap-2">
                <div className="flex gap-2 flex-col p-4 w-full items-start justify-start text-left shadow-md bg-slate-50">
                  <details className="w-full ">
                    <summary className="font-bold cursor-pointer">Q: How do I upload Excel documents?</summary>
                    <p className="mx-8">
                      A: Uploading Excel documents is as simple as clicking the Upload button on our main page. You can
                      select the file you want to work with, and SheetScanner will take care of the rest.
                    </p>
                  </details>
                </div>

                <div className="flex gap-2 flex-col p-4 w-full items-start justify-start text-left shadow-md bg-slate-50">
                  <details>
                    <summary className="font-bold cursor-pointer">
                      Q: What can I search for within uploaded Excel files?
                    </summary>
                    <p className="mx-8">
                      A: Absolutely! SheetScanners search functionality allows you to enter keywords or phrases, and it
                      will locate them within the documents youve uploaded.
                    </p>
                  </details>
                </div>

                <div className="flex gap-2 flex-col p-4 w-full items-start justify-start text-left shadow-md bg-slate-50">
                  <details>
                    <summary className="font-bold cursor-pointer">Q: How do I save objects to the clipboard?</summary>
                    <p className="mx-8">
                      A: Just click on any row within your Excel file results, and SheetScanner will save it to your
                      clipboard, ready for you to paste wherever you need it, By default it will auto-fill the form
                      aswell!
                    </p>
                  </details>
                </div>

                <div className="flex gap-2 flex-col p-4 w-full items-start justify-start text-left shadow-md bg-slate-50">
                  <details>
                    <summary className="font-bold cursor-pointer">Q: Is my data secure with SheetScanner?</summary>
                    <p className="mx-8">
                      A: We take data security seriously. Your uploaded files are processed securely, and we do not
                      store them after processing is complete. Your privacy is a top priority.
                    </p>
                  </details>
                </div>

                <div className="flex gap-2 flex-col p-4 w-full items-start justify-start text-left shadow-md bg-slate-50">
                  <details>
                    <summary className="font-bold cursor-pointer">Q: Can I save my progress?</summary>
                    <p className="mx-8">
                      A: Yes, you can! SheetScanner doubles as a form-filling and note-taking tool, making it a
                      versatile solution for various tasks.
                    </p>
                  </details>
                </div>
                <div className="flex gap-2 flex-col p-4 w-full items-start justify-start text-left shadow-md bg-slate-50">
                  <details>
                    <summary className="font-bold cursor-pointer">
                      Q: What file formats and sizes are supported?
                    </summary>
                    <p className="mx-8">
                      A: Currently, SheetScanner supports the XLS, XLSX, and CSV file formats. The maximum file size is
                      3000 KB. If your file exceeds this limit, we recommend splitting the data into smaller
                      spreadsheets. It&apos;s important to note that SheetScanner allows you to scan multiple sheets
                      simultaneously.
                    </p>
                  </details>
                </div>
              </div>

              <div className="flex flex-row items-center flex-wrap gap-2 justify-center">
                <Link className="bg-green-700 rounded" href='/scanner/guest'>
                  Check it out!
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center w-full lg:w-1/2">
            <div className="">
              <Image
                src="/images/faq.png"
                width="616"
                height="617"
                className={'object-cover'}
                alt="Hero Illustration"
                loading="eager"
              />
              <a
                className="rounded text-gray-800 hover:text-white text-sm"
                href="https://www.freepik.com/free-vector/mental-health-wellness-composition-workplace-icons-with-human-character-worker-with-reactions-chat-bubbles-vector-illustration_38753728.htm#query=flat%20design%20excel&position=5&from_view=search&track=ais&uuid=f991704e-4e03-4555-83d8-3788de19a847"
                target="_blank"
                rel="noopener noreferrer"
              >
                Image by macrovector on Freepik
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutApp;
