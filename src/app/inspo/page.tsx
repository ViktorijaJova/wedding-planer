"use client";

import { useRef, useState } from "react";
import { useWeddingTemplate } from "@/components/wedding-template/WeddingTemplateProvider";

export default function InspirationPage() {
  const {
    state: { inspiration },
    updateInspiration,
    uploadInspirationImage,
    removeInspirationImage,
    uploadInspirationFile,
    removeInspirationFile,
  } = useWeddingTemplate();

  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      await uploadInspirationImage(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      await uploadInspirationFile(file);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file");
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-5 md:space-y-6">
      <section className="wedding-card px-4 py-4 md:px-5 md:py-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-sage-dark/70">
              Inspiration
            </p>
            <h2 className="mt-1 font-display text-xl text-sage-dark md:text-2xl">
              Moodboard & day vision
            </h2>
            <p className="mt-2 max-w-xl text-[0.8rem] text-sage-dark/80">
              This page is just for you. Paste links from Canva or Pinterest,
              write out ideas, and keep everything about how the day should feel
              in one calm place.
            </p>
          </div>
          <p className="text-[0.75rem] text-sage-dark/70 md:text-right max-w-xs">
            All of this is saved locally in your browser. It won&apos;t be shown
            to guests &mdash; it&apos;s your private planning board.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 md:gap-5">
        <div className="wedding-card px-4 py-4 md:px-5 md:py-5 space-y-3">
          <h3 className="font-display text-sm uppercase tracking-[0.2em] text-sage-dark/80">
            Upload inspiration images
          </h3>
          <p className="text-[0.8rem] text-sage-dark/75">
            Upload screenshots, mood board images, and design inspiration photos.
          </p>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploadingImage}
            className="w-full rounded-md border border-sage/25 bg-white/90 px-3 py-2 text-[0.8rem] text-sage-dark file:rounded-md file:border-0 file:bg-gold file:px-3 file:py-1 file:text-white file:cursor-pointer disabled:opacity-50"
          />
          {uploadingImage && (
            <p className="text-[0.75rem] text-sage-dark/70 italic">Uploading...</p>
          )}
          {inspiration.images.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-[0.75rem] font-medium text-sage-dark/80">
                Uploaded images ({inspiration.images.length}):
              </p>
              <div className="grid grid-cols-3 gap-2">
                {inspiration.images.map((img) => (
                  <div
                    key={img.id}
                    className="relative group rounded-md overflow-hidden bg-ivory border border-sage/25"
                  >
                    <img
                      src={img.data}
                      alt={img.name}
                      className="w-full h-20 object-cover"
                    />
                    <button
                      onClick={() => removeInspirationImage(img.id)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium"
                    >
                      Remove
                    </button>
                    <p className="text-[0.65rem] text-sage-dark/70 p-1 truncate">
                      {img.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="wedding-card px-4 py-4 md:px-5 md:py-5 space-y-3">
          <h3 className="font-display text-sm uppercase tracking-[0.2em] text-sage-dark/80">
            Upload documents & files
          </h3>
          <p className="text-[0.8rem] text-sage-dark/75">
            Upload PDFs, spreadsheets, and other files like contracts, seating charts, or vendor info.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            disabled={uploadingFile}
            className="w-full rounded-md border border-sage/25 bg-white/90 px-3 py-2 text-[0.8rem] text-sage-dark file:rounded-md file:border-0 file:bg-gold file:px-3 file:py-1 file:text-white file:cursor-pointer disabled:opacity-50"
          />
          {uploadingFile && (
            <p className="text-[0.75rem] text-sage-dark/70 italic">Uploading...</p>
          )}
          {inspiration.files.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-[0.75rem] font-medium text-sage-dark/80">
                Uploaded files ({inspiration.files.length}):
              </p>
              <ul className="space-y-1">
                {inspiration.files.map((file) => (
                  <li
                    key={file.id}
                    className="flex items-center justify-between gap-2 p-2 rounded-md bg-ivory border border-sage/25 text-[0.8rem] text-sage-dark"
                  >
                    <span className="truncate">{file.name}</span>
                    <button
                      onClick={() => removeInspirationFile(file.id)}
                      className="flex-shrink-0 text-gold hover:text-gold/80 font-medium text-[0.75rem]"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 md:gap-5">
        <div className="wedding-card px-4 py-4 md:px-5 md:py-5 space-y-3">
          <h3 className="font-display text-sm uppercase tracking-[0.2em] text-sage-dark/80">
            Photo inspo & Canva boards
          </h3>
          <p className="text-[0.8rem] text-sage-dark/75">
            Paste links to your Canva boards, Pinterest, or describe the vibes:
            venue, dress, flowers, stationery, lighting.
          </p>
          <textarea
            value={inspiration.photoInspo}
            onChange={(e) =>
              updateInspiration({ photoInspo: e.target.value })
            }
            rows={6}
            placeholder={`Examples:
- Canva moodboard: https://...
- Pinterest board: https://...
- Keywords: modern, minimal, soft blush, candlelight, black accents`}
            className="w-full rounded-md border border-sage/25 bg-white/90 px-3 py-2 text-[0.8rem] text-sage-dark outline-none focus:border-gold"
          />

          <h3 className="mt-4 font-display text-sm uppercase tracking-[0.2em] text-sage-dark/80">
            Save the date & videos
          </h3>
          <p className="text-[0.8rem] text-sage-dark/75">
            Link your save-the-date video and any other clips that capture the
            feeling of the day.
          </p>
          <textarea
            value={inspiration.videoInspo}
            onChange={(e) =>
              updateInspiration({ videoInspo: e.target.value })
            }
            rows={4}
            placeholder={`Examples:
- Save the date video: file name or link
- Songs or reels that feel like your day`}
            className="w-full rounded-md border border-sage/25 bg-white/90 px-3 py-2 text-[0.8rem] text-sage-dark outline-none focus:border-gold"
          />
        </div>

        <div className="wedding-card px-4 py-4 md:px-5 md:py-5 space-y-3">
          <h3 className="font-display text-sm uppercase tracking-[0.2em] text-sage-dark/80">
            Colour palette
          </h3>
          <p className="text-[0.8rem] text-sage-dark/75">
            Write the colour palette you&apos;re dreaming of: main colours,
            accent, metallics, what guests should feel when they walk in.
          </p>
          <textarea
            value={inspiration.colorPalette}
            onChange={(e) =>
              updateInspiration({ colorPalette: e.target.value })
            }
            rows={4}
            placeholder={`Examples:
- Main: ivory, soft blush, warm nude
- Accent: black, deep espresso
- Metallic: brushed gold
- No bright red/orange, keep everything soft and minimal`}
            className="w-full rounded-md border border-sage/25 bg-white/90 px-3 py-2 text-[0.8rem] text-sage-dark outline-none focus:border-gold"
          />

          <h3 className="mt-4 font-display text-sm uppercase tracking-[0.2em] text-sage-dark/80">
            Accessories & details
          </h3>
          <p className="text-[0.8rem] text-sage-dark/75">
            Bouquet, veil, jewellery, shoes, hair, nails, signage, candles,
            napkins &ndash; all the small things that make it feel like you.
          </p>
          <textarea
            value={inspiration.accessories}
            onChange={(e) =>
              updateInspiration({ accessories: e.target.value })
            }
            rows={6}
            placeholder={`Examples:
- Bouquet: white roses + tiny wildflowers
- Veil: long, simple, no glitter
- Stationery: thin serif font, no big script, black ink on textured paper`}
            className="w-full rounded-md border border-sage/25 bg-white/90 px-3 py-2 text-[0.8rem] text-sage-dark outline-none focus:border-gold"
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 md:gap-5">
        <div className="wedding-card px-4 py-4 md:px-5 md:py-5 space-y-3">
          <h3 className="font-display text-sm uppercase tracking-[0.2em] text-sage-dark/80">
            Menu for the day
          </h3>
          <p className="text-[0.8rem] text-sage-dark/75">
            Write out the food plan: welcome snacks, main dinner, dessert,
            midnight snacks. Note allergies or ideas to ask the caterer.
          </p>
          <textarea
            value={inspiration.dayMenu}
            onChange={(e) => updateInspiration({ dayMenu: e.target.value })}
            rows={8}
            placeholder={`Examples:
- Welcome: small bites, nothing messy
- Main: 2 meat options + 1 veggie
- Dessert: cake + mini desserts
- Midnight: something salty`}
            className="w-full rounded-md border border-sage/25 bg-white/90 px-3 py-2 text-[0.8rem] text-sage-dark outline-none focus:border-gold"
          />
        </div>

        <div className="wedding-card px-4 py-4 md:px-5 md:py-5 space-y-3">
          <h3 className="font-display text-sm uppercase tracking-[0.2em] text-sage-dark/80">
            Drinks & bar
          </h3>
          <p className="text-[0.8rem] text-sage-dark/75">
            Signature cocktails, wine choices, non-alcoholic options, shots yes
            or no, how you want the bar to feel.
          </p>
          <textarea
            value={inspiration.drinksMenu}
            onChange={(e) =>
              updateInspiration({ drinksMenu: e.target.value })
            }
            rows={6}
            placeholder={`Examples:
- 1–2 signature cocktails (name ideas)
- Sparkling wine for toasts
- Nice non-alcoholic options (not just juice)`}
            className="w-full rounded-md border border-sage/25 bg-white/90 px-3 py-2 text-[0.8rem] text-sage-dark outline-none focus:border-gold"
          />

          <h3 className="mt-4 font-display text-sm uppercase tracking-[0.2em] text-sage-dark/80">
            Orders & to-dos
          </h3>
          <p className="text-[0.8rem] text-sage-dark/75">
            Things to order and when: candles, napkins, signage, gifts, beauty
            appointments, printing, etc.
          </p>
          <textarea
            value={inspiration.ordersChecklist}
            onChange={(e) =>
              updateInspiration({ ordersChecklist: e.target.value })
            }
            rows={6}
            placeholder={`Examples:
- By March: book hair & makeup
- By April: order candles & holders
- By May: print menus & place cards`}
            className="w-full rounded-md border border-sage/25 bg-white/90 px-3 py-2 text-[0.8rem] text-sage-dark outline-none focus:border-gold"
          />
        </div>
      </section>

      <section className="wedding-card px-4 py-4 md:px-5 md:py-5 space-y-3">
        <h3 className="font-display text-sm uppercase tracking-[0.2em] text-sage-dark/80">
          Other ideas & notes
        </h3>
        <p className="text-[0.8rem] text-sage-dark/75">
          Anything that doesn&apos;t fit above: speeches, first dance ideas,
          photo list, rain plan, small surprises for guests.
        </p>
        <textarea
          value={inspiration.otherIdeas}
          onChange={(e) => updateInspiration({ otherIdeas: e.target.value })}
          rows={6}
          className="w-full rounded-md border border-sage/25 bg-white/90 px-3 py-2 text-[0.8rem] text-sage-dark outline-none focus:border-gold"
        />
      </section>
    </div>
  );
}

