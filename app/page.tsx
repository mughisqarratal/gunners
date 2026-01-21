import { cookies } from "next/headers";
import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import {
  SiSpotify,
  SiApplemusic,
  SiSoundcloud,
  SiYoutubemusic,
} from "react-icons/si";

export default async function Home() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("user_id");

  return (
    <main className="flex flex-col items-center justify min-h-screen bg-[#000000] text-center">
      <section className="relative min-h-[45vh] sm:min-h-[70vh] lg:h-screen w-full overflow-hidden ">
        {/* Video background */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/images/vid.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        {/* Overlay gelap */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Konten */}
        <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
          <h1
            className="text-white font-bold leading-tight px-5 py-35
              sm:px-6 sm:py-4
              lg:px-10 lg:py-6
              text-2xl sm:text-3xl lg:text-5xl
              sm:font-bold"
          >
            The Official Indonesian <br className="hidden sm:block"/>
            Guns N' Roses Fan Site
          </h1>
        </div>
      </section>

      <h1 className="text-3xl sm:text-5md font-bold text-[#F3B800] mb-0 leading-tight mt-0">
        A Big Tribute to
      </h1>
      <h1 className="text-3xl sm:text-5md font-bold text-[#F3B800] mb-3 leading-tight mt-2">
        Guns N' Roses from Indonesia
      </h1>

      <p className="text-base sm:text-2xl text-gray-50 w-auto sm:w-230">
        Guns N' Roses is an American hard rock band formed in Los Angeles,
        California, in 1985 from L.A. Guns and Hollywood Rose. After signing
        with Geffen Records in 1986, the band's "classic" lineup featured
        vocalist Axl Rose, lead guitarist Slash, rhythm guitarist Izzy Stradlin,
        bassist Duff McKagan, and drummer Steven Adler.
      </p>

      <div className="mt-6 flex items-center mb-2">
        <ul>
          {!isLoggedIn && (
            <>
              <li>
                <button
                  className="font-bold bg-[#F3B800] hover:bg-[#ffd149] py-1.5 px-5.5
                  rounded-full border border-gray-50 border-hover:bg-[#07d9f5]"
                >
                  <a href="/register">Sign Up</a>
                </button> 
              </li>

              <li className="pt-4">
                <button
                  className="font-bold bg-[#F3B800] hover:bg-[#ffd149] py-1.5 px-7
                  rounded-full border border-gray-50 border-hover:bg-[#07d9f5]"
                >
                  <a href="/login">Login</a>
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="mt-5 space-y-10">
        {/* SOCIALS */}
        <div>
          {/* <h1 className="font-corvinus text-6xl text-amber-50">CORVINUS WORKS</h1> */}
          <h2 className="text-2xl font-bold text-[#F3B800] mb-4">Socials</h2>
          <div className="flex justify-center gap-6 mb-6">
            <a
              href="https://www.instagram.com/gunsnroses?igsh=cGV1eGxodnVnNTB6"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="w-8 h-8 text-white hover:text-[#F3B800] transition-transform duration-100 hover:scale-110 " />
            </a>
            <a
              href="https://facebook.com/gunsnroses"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook className="w-8 h-8 text-white hover:text-[#F3B800] transition-transform duration-100 hover:scale-110" />
            </a>
            <a
              href="https://x.com/gunsnroses"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="w-8 h-8 text-white hover:text-[#F3B800] transition-transform duration-100 hover:scale-110" />
            </a>
            <a
              href="https://www.tiktok.com/@gunsnroses?_r=1&_t=ZS-92clQZJ4Wv9"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTiktok className="w-8 h-8 text-white hover:text-[#F3B800] transition-transform duration-100 hover:scale-110" />
            </a>
            <a
              href="https://youtube.com/@gunsnroses?si=HEl4rWhc8herbf9c"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube className="w-8 h-8 text-white hover:text-[#F3B800] transition-transform duration-100 hover:scale-110" />
            </a>
          </div>
        </div>

        {/* LISTEN */}
        <div>
          <h2 className="text-2xl font-bold text-[#F3B800] mb-4">
            Listen Guns N' Roses
          </h2>

          <div className="flex justify-center gap-6 flex-wrap mb-10">
            <a
              href="https://open.spotify.com/artist/3qm84nBOXUEQ2vnTfUTTFC?si=Q3L3oCOxRReZaovrIkakVw"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiSpotify
                className="transition-transform duration-100 hover:scale-110"
                size={32}
                color="#1DB954"
              />
            </a>
            <a
              href="https://music.apple.com/us/artist/guns-n-roses/106621"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiApplemusic
                className="transition-transform duration-100 hover:scale-110"
                size={32}
                color="#FA243C"
              />
            </a>
            <a
              href="https://music.youtube.com/channel/UCSLbbBoUqpin6BE34whSOvA"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiYoutubemusic
                className="transition-transform duration-100 hover:scale-110"
                size={32}
                color="#FF0000"
              />
            </a>
            <a
              href="https://soundcloud.com/guns-n-roses-official"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiSoundcloud
                className="transition-transform duration-100 hover:scale-110"
                size={32}
                color="#FF5500"
              />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
