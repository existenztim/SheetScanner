'use client';
import Image from 'next/image';
import Link from 'next/link';
import { GlobalContext } from './ParentProvider';
import { removeBlankSpace } from '../utils/stringManipulation';
import { FaGithub } from 'react-icons/fa';

const AboutApp = () => {
  const { user, settings } = GlobalContext();
  const displayName = removeBlankSpace(user?.displayName);
  const encodedDisplayName = encodeURIComponent(displayName || 'guest');

  /**************************************************************
                         Markup
  **************************************************************/
  return (
    <>
      <div
        className={
          settings.animations
            ? 'sheetscanner-fadein flex flex-col justify-center items-center bg-slate-50 mt-[-3rem]'
            : 'flex flex-col justify-center items-center bg-slate-50 mt-[-3rem]'
        }
      >
        {/* INTRO */}
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
                <Link
                  className="sheetScanner-standard-link bg-green-700 rounded text-slate-50 sheetScanner-hover"
                  href={`/scanner/${encodedDisplayName}`}
                >
                  Check it out!
                </Link>
                <a
                  className="sheetScanner-standard-link bg-yellow-600 text-gray-800 hover:text-gray-50 rounded"
                  href="#how"
                >
                  Tell me how it works
                </a>

                <a
                  href="https://github.com/existenztim/SheetScanner"
                  target="_blank"
                  rel="noopener"
                  className="sheetScanner-standard-link flex rounded-md items-center space-x-2 text-gray-800 hover:text-white hover:bg-black"
                >
                  <span className="flex items-center gap-2">
                    View on Github <FaGithub />
                  </span>
                </a>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center w-full lg:w-1/2">
            <div className="relative group">
              <Image
                src="/images/excels.webp"
                width="616"
                height="529"
                className={'object-cover'}
                alt="Hero Illustration"
                loading="eager"
              />
              <a
                className="absolute top-2 right-28 px-2 rounded text-gray-800 text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:bg-yellow-600 hover:text-slate-50"
                href="https://www.freepik.com/free-vector/mental-health-wellness-composition-workplace-icons-with-human-character-worker-with-reactions-chat-bubbles-vector-illustration_38753728.htm#query=flat%20design%20excel&position=5&from_view=search&track=ais&uuid=f991704e-4e03-4555-83d8-3788de19a847"
                target="_blank"
                rel="noopener noreferrer"
              >
                Image by macrovector on Freepik
              </a>
            </div>
          </div>
        </section>
        {/* HOW */}
        <section id="how" className="flex flex-wrap px-2 min-h-screen bg-green-100 pb-4">
          <div className="flex items-center justify-center w-full lg:w-1/2">
            <div className="relative group">
              <Image
                src="/images/how.webp"
                width="616"
                height="616"
                className={'object-cover'}
                alt="Illustration of a laptop with an Excel document being printed"
                loading="eager"
              />
              <a
                className="absolute bottom-16 right-24 px-2 rounded text-gray-800 text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:bg-yellow-600 hover:text-slate-50"
                href="https://www.freepik.com/free-vector/spreadsheets-concept-illustration_6450136.htm#query=excel%20laptop&position=1&from_view=search&track=ais&uuid=2ac96803-a12b-42df-be43-786662b47a14"
                target="_blank"
                rel="noopener noreferrer"
              >
                Image by storyset on Freepik
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
                <Link
                  className="sheetScanner-standard-link sheetScanner-hover text-slate-50 bg-green-700 rounded"
                  href={`/scanner/${encodedDisplayName}`}
                >
                  Check it out!
                </Link>
                <a
                  href="#faq"
                  className="sheetScanner-standard-link bg-yellow-600 text-gray-800 hover:text-gray-50 rounded"
                >
                  Common questions
                </a>
              </div>
            </div>
          </div>
        </section>
        {/* FAQ */}
        <section id="faq" className="flex flex-wrap px-2 min-h-screen pb-4 bg-green-200 mb-12 rounded-b-lg">
          <div className="flex items-center w-full mt-6 lg:w-1/2">
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
                      A: Uploading Excel documents is as simple as clicking the Upload button on our scanner page. You
                      can select the file you want to work with, and SheetScanner will take care of the rest.
                    </p>
                  </details>
                </div>

                <div className="flex gap-2 flex-col p-4 w-full items-start justify-start text-left shadow-md bg-slate-50">
                  <details className="w-full">
                    <summary className="font-bold cursor-pointer">
                      Q: How do I prepare my Excel document for upload?
                    </summary>
                    <p className="mx-8">
                      A: To ensure smooth processing, make sure your Excel document is prepared with relevant headers
                      for your data. These headers must be placed in the first row (A1, B1, C1, and so on). There is no
                      limit to how many headers you can have, but keep in mind that the more headers you include, the
                      data may become harder to manage.
                    </p>
                  </details>
                </div>

                <div className="flex gap-2 flex-col p-4 w-full items-start justify-start text-left shadow-md bg-slate-50">
                  <details>
                    <summary className="font-bold cursor-pointer">
                      Q: What can I search for within uploaded Excel files?
                    </summary>
                    <p className="mx-8">
                      A: Anything! SheetScanners search functionality allows you to enter keywords or phrases, and it
                      will locate them within the documents you&apos;ve uploaded.
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
                      versatile solution for various tasks. Just make sure you are signed in with yout Gmail account to
                      take advantage of it.
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
                <Link
                  className="sheetScanner-standard-link bg-green-700 text-slate-50 rounded sheetScanner-hover"
                  href={`/scanner/${encodedDisplayName}`}
                >
                  Check it out!
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center w-full lg:w-1/2">
            <div className="relative group">
              <Image
                src="/images/faq.webp"
                width="616"
                height="616"
                className={'object-cover'}
                alt="2 focused people standing next to a question mark, eager to learn more."
                loading="eager"
              />
              <a
                className="absolute bottom-6 left-24 px-2 rounded text-gray-800 text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:bg-yellow-600 hover:text-slate-50"
                href="https://www.freepik.com/free-vector/flat-people-asking-questions-illustration_13379593.htm#query=flat%20design%20questions&position=16&from_view=search&track=ais&uuid=2f5f5b15-f3b0-4f94-bf8e-62956502846b"
                target="_blank"
                rel="noopener noreferrer"
              >
                Image by Freepik
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutApp;
