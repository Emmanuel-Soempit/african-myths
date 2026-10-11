import { culture_dummy } from "../../culture-detail/utils/dummy";
import { cultures_dummy, myths_dummy } from "../../home/utils/dummy";
import { MythDetail } from "../types";

export const myth_detail_dummy: MythDetail = {
    culture: cultures_dummy[0],
    myths: culture_dummy.myths,
    id: 'x',
    content: `  <article
          class="prose prose-lg lg:prose-xl dark:prose-invert prose-headings:font-sans prose-p:text-lg prose-p:leading-relaxed prose-a:text-[#D4A373] prose-blockquote:border-[#D4A373] prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400 max-w-none">
          <p>
            In the beginning, there were no stories in the world. The Sky-God, Nyame, had them all, kept safe in a
            golden box beside his throne. Anansi the Spider, a clever and cunning trickster, yearned for these stories.
            He wanted to bring them down to the people of the earth. So, he spun a long, silver thread and climbed up to
            the sky to speak with Nyame.
          </p>
          <p>
            "Nyame," Anansi said with a bow, "I wish to buy your stories."
          </p>
          <p>
            The Sky-God laughed. "Many have tried and failed, little spider. The price is high. You must bring me three
            things: Mmoboro, the hornets who sting like fire; Onini, the great python who can swallow a man whole; and
            Osebo, the leopard with teeth like daggers."
          </p>
          <figure class="my-12">
            <img class="w-full rounded-lg object-cover"
              data-alt="An artistic illustration of a golden spiderweb against a dark, cosmic background."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCL9h38O00ep8N8mL1V_jZYJD91Cb2w1Wlfm_Wz3KZtwjJaPhH42NaJQsZzDX-8on-oQIMjp79T0Q0HlF9vYy3Vfu1rJWYM9_Xp0vLaXQpDjQGd9f8ZwtKDuOVKctJnoXztGcUF2oWA68AkhPFw5M389TAqDdxKY2qRJURFzI0BCiPimEnj2_GLVvUeSP_agnUOhYRr2-3G8q62ORqN37dYtiqEiAXsFlEqNudYkYDsUi1u9dDdcr12ZRHtaHO5QIwMVgmUFP6tZWM" />
            <figcaption class="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">Anansi contemplating the
              Sky-God's impossible price.</figcaption>
          </figure>
          <p>
            Anansi did not despair. He returned to Earth and first went to the hornets' nest. "They say you are fools,"
            he taunted, holding a large, empty calabash. "They say you cannot fly into this small gourd." Angered, the
            hornets swarmed inside to prove him wrong, and Anansi quickly sealed the opening.
          </p>
          <blockquote>
            <p>With cunning and wit, Anansi showed that strength is not always measured in size, but in the sharpness of
              the mind.</p>
          </blockquote>
          <p>
            Next, he found Onini the python. "My wife and I disagree," Anansi said. "She says you are not as long as
            this palm branch." The proud python stretched himself out against the branch, and Anansi swiftly tied him to
            it with strong creepers.
          </p>
          <p>
            Finally, for Osebo the leopard, Anansi dug a deep pit. When the leopard fell in, Anansi offered to help him
            out using his web. But as he pulled the leopard up, he tied him to a tree. With all three captives, Anansi
            returned to the Sky-God. Nyame was amazed. He declared, "Anansi, you have paid the price. From this day, all
            stories belong to you. They shall be called 'Spider Stories'." And that is how Anansi became the keeper of
            stories, sharing them with all the people of the world.
          </p>
          <div class="mt-12 text-sm text-gray-500 dark:text-gray-400 italic">
            <p>Source: A traditional Akan folktale, retold for Kólà.</p>
          </div>
          </div>
        </article>`,
    tags: ['Trickery', 'Wisdom', 'Creation'],
    title: 'How Anansi Became the Keeper of Stories',
    image: myths_dummy[0].image,
    time: '7 mins',
    source: 'ource: A traditional Akan folktale, retold for Kólà.'
}