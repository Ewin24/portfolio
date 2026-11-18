# Plain-language voice for the essays

Edwin's feedback, verbatim: "me gustaria que pongamos titulos y contenido escrito en un lenguaje mas humanoy simple, veo que usas terminos y frases demasiado genericas cosas como \"Once rondas de revisión con AI no reemplazan diez minutos de un usuario\". hay opciones como Puedes pedirle once rondas de revisión a la IA, pero nada reemplaza diez minutos escuchando a un usuario de verdad o \"Por qué diez minutos de feedback real ganan frente a las iteraciones con IA\""

## Who reads

A developer or a team lead who is curious about the subject and has not lived the story. They are bright and they are busy. They read on a phone. Many read Spanish or English as a second language. Write the way Edwin would tell it to a colleague over coffee: someone he respects, who can interrupt and ask "meaning what?".

## Titles

The current titles are compressed slogans. They sound clever and tell the reader little. A good title is a sentence a person would say out loud, and it tells the reader what they will get.

- Before: "Once rondas de revisión con AI no reemplazan diez minutos de un usuario"
- After (either shape works): "Puedes pedirle once rondas de revisión a la AI, pero nada reemplaza diez minutos escuchando a un usuario de verdad" or "Por qué diez minutos de feedback real ganan frente a las iteraciones con AI"

Shapes that work: talking to the reader ("Puedes...", "Si tu agente..."), a "why" or "how" promise, or a first-person result ("Le pedí once revisiones a la AI y un usuario encontró el problema en diez minutos") when the essay's own facts support it. Shapes to drop: "X is Y, not Z", "X proposes; Y decides", two clauses joined by a colon or semicolon, a noun phrase with no verb, any word the reader needs the essay to understand (arnés, curaduría, caracterizar, refutar). Titles may be longer than today's; clear beats short. Do not promise more than the essay shows.

The Spanish and the English title say the same thing, each written naturally in its language, not translated word by word.

## Body

Keep the argument, the order of ideas and every piece of evidence. Change how it is said.

- Use the everyday word. "Usar" over "emplear", "arreglar" over "subsanar", "show" over "demonstrate". If a technical term is needed (harness, context window, characterization test), say what it is in plain words the first time, then keep using that one term.
- One idea per sentence. Split a sentence when it carries two. Prefer a full stop to a semicolon; use no semicolons at all if you can.
- Say the thing directly. Replace an abstract claim with the concrete case behind it: what happened, to whom, with which number. The essays already hold these facts; put them first and the conclusion after.
- First person, active verbs: "medí", "me equivoqué", "I checked". The stories are Edwin's and already told in the first person; keep them so.
- Talk to the reader with "tú" in Spanish (neutral Latin American Spanish, no regional slang) and "you" in English.
- Headings are plain labels or plain questions that say what the section covers ("Qué pasó cuando lo probó una persona", "Dónde puedo estar equivocado"), not slogans.
- Excerpts: two or three short sentences that say what happened and what the reader takes away. Today's excerpts are one dense paragraph; make them easy to read on a card.

## Patterns to remove

These are what make the current text sound generic. Rewrite the sentence when you see one; do not swap it for its nearest cousin.

- Contrast slogans: "no es X, es Y", "X, no Y", "less X, more Y", "it's not about X".
- A short punchy sentence closing a paragraph that only repeats what the paragraph said.
- Groups of three by reflex ("rápido, barato y simple") when the facts give two or four.
- Abstract nouns doing a verb's job ("la curaduría de la memoria", "the validation of the output"): use the verb and name who does it.
- Empty intensifiers and announcements: "realmente", "fundamental", "clave", "la verdad es que", "honestly", "it's worth noting", "here's the thing".
- Questions asked only to answer them in the next sentence.
- Metaphors standing in for the claim. Say the claim.
- Em dashes and semicolons used to chain clauses. Use commas, full stops or parentheses.

Do not go the other way into chatty filler, jokes, exclamation marks or emoji. Plain and warm, still precise.

## What must not change

- `slug`, `id`, `date`, `tags`, `category`, `series`, `seriesOrder`, `featured`, `relatedIds` and every other non-text field.
- Every fact, number, date, quote, source link and code block. Do not add facts, examples, anecdotes or numbers that are not already in the post. Do not remove a caveat or the section that says where the essay could be wrong.
- Every figure embed line `![alt](figure/<id> "Caption")`: keep the id; the alt text and the caption may be reworded in the same plain voice.
- In the figure description file: ids, types, data, step structure and every key stay; only human-readable strings (titles, labels, narration, captions) may be reworded, both languages, and only where they use the patterns above or an unexplained term. Short labels that are already plain stay as they are.
- Markdown conventions of the post files: content lives in template literals, so escape backticks and `${`; a paragraph that is only `**Text**` is a heading.
- Length: within about 15 % of the current word count per language. Simpler does not mean shorter by cutting evidence.
- Spanish keeps the abbreviation "AI" (the site and the series "Trabajar con AI" use it).
