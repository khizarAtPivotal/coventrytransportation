const focusableSelector = [
  "a[href]:not([tabindex='-1'])",
  "area[href]:not([tabindex='-1'])",
  "input:not([disabled]):not([tabindex='-1'])",
  "select:not([disabled]):not([tabindex='-1'])",
  "textarea:not([disabled]):not([tabindex='-1'])",
  "button:not([disabled]):not([tabindex='-1'])",
  "iframe:not([tabindex='-1'])",
  "[tabindex]:not([tabindex='-1'])",
  "[contentEditable=true]:not([tabindex='-1'])",
].join(",");

const headingsSelector = "h1,h2,h3,h4,h5,h6";

const a11yOnReady = ($) => (e) => {
  $("body").append(
    '<div class="sr-only live-status-region" role="status"></div>'
  );

  $("#home-section1").each((i, el) => {
    if (i === 0) {
      return;
    }

    el.removeAttribute("id");
  });

  // Other A11y: Fleet: Image missing alternative text
  $(".fusion-imageframe .fusion-lightbox").each((i, el) => {
    $(el)
      .children("img:not([alt])")
      .attr({
        alt: el.getAttribute("title"),
      });
  });

  // 	Other A11y: Home: Autocomplete attribute not provided
  $('input[name="your-name"]').attr({
    autocomplete: "name",
  });

  $('input[name="your-email"]').attr({
    autocomplete: "email",
  });

  $('input[name="your-phone"]').attr({
    autocomplete: "tel",
  });

  $('input[name="your-city"]').attr({
    autocomplete: "address-level2",
  });

  // Screen Reader: Home: Image provided incorrect alternative text
  $('img[src$="wp-content/uploads/2017/12/coventrylogo.png"]').attr({
    alt: "Coventry Transpotaion",
  });

  // Screen Reader: Home: Headings like 'TESTIMONIALS' implemented incorrectly
  $(".change_to_h2").attr({
    role: "heading",
    "aria-level": 2,
  });

  $(".change_to_h3").attr({
    role: "heading",
    "aria-level": 3,
  });

  $(".change_child_to_h2").each((i, el) => {
    $(el).find(headingsSelector).attr({
      role: "heading",
      "aria-level": 2,
    });
  });

  $(".wpcf7-form").each((i, el) => {
    const response = $(el).find(".wpcf7-response-output");
    const modal = $(el).closest(".fusion-modal");

    if (el.classList.contains("invalid") && modal.length > 0) {
      modal.show().addClass("in");
    }

    response.removeAttr("aria-hidden").attr({
      tabindex: "-1",
    });

    $(el)
      .find('.wpcf7-form-control[aria-required="true"][name]')
      .each((i, el) => {
        const id = randomId(20);
        const errorEl = $(el).siblings(".wpcf7-not-valid-tip");
        const defaultErrorText = errorEl.text();

        $(el).attr({
          "aria-describedby": id,
        });

        errorEl.attr({
          id: id,
        });

        $('.wpcf7-form-control[aria-invalid="true"]').first().focus();

        errorEl.removeAttr("aria-hidden").removeAttr("role");

        if (defaultErrorText) {
          response.append(`<p>${defaultErrorText}</p>`);
        }

        $('.wpcf7-form-control[aria-invalid="true"]').first().focus();
      });
  });

  $('img:not([alt=""])').removeAttr("title");
  $('form[action="/contact-us/#wpcf7-f16-p605-o1"] [name="menu-623"]').attr(
    "aria-label",
    "Department"
  );
  $("#fleet-full-container-id h5.fusion-responsive-typography-calculated").attr(
    { role: "heading", "aria-level": "3" }
  );

  // 	Screen Reader: Fleet: Incorrect role provided to the buttons under the heading 'BLACK CARS & SUVS'
  $('a.fusion-lightbox[href$=".jpg"][data-rel="iLightbox[Fleet]"]').each(
    (i, el) => {
      $(el).attr({
        role: "button",
      });
    }
  );

  // Screen Readers: Home: Home link not announced as current page
  $(".fusion-menu .current_page_item > a").attr({
    "aria-current": "page",
  });

  $('a[class^="fusion-modal"][data-toggle="modal"]').each((i, el) => {
    const modal = $(el.getAttribute("data-target"));

    const observer = new MutationObserver((mutationList) => {
      for (const mutation of mutationList) {
        if (modal.attr("aria-hidden") === "true") {
          $(el).focus();
          continue;
        }

        const focusableElements = modal.find(focusableSelector);

        focusableElements.last().on("keydown", (e) => {
          if (e.originalEvent.code === "Tab" && !e.originalEvent.shiftKey) {
            e.preventDefault();
            focusableElements.first().focus();
          }
        });

        focusableElements.first().on("keydown", (e) => {
          if (e.originalEvent.code === "Tab" && e.originalEvent.shiftKey) {
            e.preventDefault();
            focusableElements.last().focus();
          }
        });
      }
    });

    observer.observe(modal.get(0), {
      attributes: true,
      attributeFilter: ["aria-hidden"],
    });
  });

  $(".menu-item-has-children").each((i, el) => {
    const anchor = $(el).children("a");
    const subMenu = $(el).children(".sub-menu");

    $(window).on("keydown", (e) => {
      if (e.originalEvent.code === "Escape") {
        subMenu.addClass("hidden");
      }
    });

    anchor.on("focus", (e) => {
      subMenu.removeClass("hidden");
    });

    anchor.on("mouseover", (e) => {
      subMenu.removeClass("hidden");
    });
  });
};

const a11yOnLoad = ($) => (e) => {
  console.log("Load");

  setTimeout(() => {
    $(".homepage__read-more").each((i, el) => {
      const siblings = $(el).siblings(".ls-layer-link");
      const label = `${$(el).text().trim()} (${$(".homepage__read-more_title")
        .eq(i)
        .text()
        .trim()})`;

      if (siblings.length > 0) {
        siblings.attr({
          "aria-label": label,
        });
      }

      if ($(el).hasClass("rs-layer")) {
        $(el).attr({
          "aria-label": label,
        });
      }
    });
  }, 100);

  // 	Screen Reader: About Us: Multiple links having same name
  $('.fusion-footer-widget-column a[href^="tel:"]').each((i, el) => {
    const href = el.getAttribute("href");
    const number = href.split(":").at(-1);

    $(el).attr({
      "aria-label": `Call at ${number}`,
    });
  });

  // 	Screen Reader: Pmdms: Heding tag implemented incorrectly
  $("body.author .fusion-author-title").each((i, el) => {
    const clone = $(el).clone();
    clone.find(".fusion-edit-profile").remove();

    $(el).attr({
      role: "heading",
      "aria-level": 1,
    });

    $(el).attr({
      "aria-label": `${clone
        .text()
        .trim()
        .replace(/(\r\n|\n|\r)/gm, "")}`,
    });
  });

  $("a.fusion-modal-text-link[data-toggle]").attr({
    role: "button",
    tabindex: "0",
  });

  // 	Screen Reader: Booking: 'Online Booking' is not read by the screen reader
  $(".modal-dialog").each((i, el) => {
    $(el)
      .find("button.close")
      .attr({
        "aria-label": "Close",
        role: "button",
      })
      .removeAttr("aria-hidden");

    $(el)
      .find("h3.modal-title")
      .attr({
        "aria-level": "2",
        role: "heading",
      })
      .removeAttr("aria-hidden");
  });

  // 	Screen Reader: Booking: Radio buttons not grouped
  $(".wpcf7-radio").each((i, el) => {
    const label = $(el).closest("p").children("label");

    $(el).attr({
      role: "group",
      "aria-label": label.text(),
    });
  });

  // 	Screen Reader: Home: 'Loading' notification not announced automatically
  $(".wpcf7-submit").each((i, el) => {
    $(el).on("click", () => {
      announceToScreenReader("Loading");
    });
  });

  // 	Screen Reader: Services: Sufficient link text not provided
  $(".services__request-quote").each((i, el) => {
    const label = `${$(el).text().trim()} for ${$(
      ".services__request-quote-title"
    )
      .eq(i)
      .text()
      .trim()}`;

    $(el).attr({
      "aria-label": label,
    });
  });

  $(".services__book-now").each((i, el) => {
    const label = `${$(el).text().trim()} for ${$(".services__book-now-title")
      .eq(i)
      .text()
      .trim()}`;

    $(el).attr({
      "aria-label": label,
    });
  });

  $(".services__find-more").each((i, el) => {
    const label = `${$(el).text().trim()} for ${$(".services__find-more-title")
      .eq(i)
      .text()
      .trim()}`;

    $(el).attr({
      "aria-label": label,
    });
  });

  // 	Other A11y: Fleet: id attribute value must be unique
  const duplicateHomeSectionIDs = document.querySelectorAll("#home-section1");

  if (duplicateHomeSectionIDs.length > 0) {
    duplicateHomeSectionIDs.forEach((el, i) => {
      if (i === 0) {
        return;
      }

      $(el).removeAttr("id");
    });
  }

  const duplicateLsGlobalIDs = document.querySelectorAll("#ls-global");

  if (duplicateLsGlobalIDs.length > 0) {
    duplicateLsGlobalIDs.forEach((el, i) => {
      if (i === 0) {
        return;
      }

      $(el).removeAttr("id");
    });
  }

  const duplicateContactBoxIDs = document.querySelectorAll("#contact-box");

  if (duplicateContactBoxIDs.length > 0) {
    duplicateContactBoxIDs.forEach((el, i) => {
      if (i === 0) {
        return;
      }

      $(el).removeAttr("id");
    });
  }

  // 	Keyboard: Home: The 'Join Our Team' drawer is not accessible using the keyboard
  function focusTrapper(mutationList, observer) {
    for (const mutation of mutationList) {
      if (mutation.type !== "attributes") {
        continue;
      }

      const focusableElements = $(mutation.target).find(focusableSelector);

      const moveToFirst = (e) => {
        if (e.originalEvent.code === "Tab" && !e.originalEvent.shiftKey) {
          e.preventDefault();
          focusableElements.first().focus();
        }
      };

      if (mutation.target.classList.contains("shrink")) {
        focusableElements.last().unbind("keydown", moveToFirst);
        continue;
      }

      focusableElements.last().on("keydown", moveToFirst);
    }
  }

  $(".easy-sticky-sidebar").each((i, el) => {
    const classObserver = new MutationObserver(focusTrapper);

    $(window).on("keydown", (event) => {
      if (event.code === "Escape") {
        $(el).addClass("shrink");
      }
    });

    classObserver.observe(el, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const button = $(el).find(".sticky-sidebar-button");

    button.attr({
      role: "button",
      tabindex: "0",
    });

    button.on("keydown", (e) => {
      if (e.code === "Enter") {
        $(e.target).trigger("click");
      }
    });
  });

  $('.plyr__control[type="button"]').each((i, el) => {
    const tooltip = $(el).find(".plyr__tooltip");

    $(window).on("keydown", (e) => {
      if (e.originalEvent.code === "Escape") {
        tooltip.addClass("hidden");
      }
    });

    $(el).on("focus", (e) => {
      tooltip.removeClass("hidden");
    });

    $(el).on("mouseover", (e) => {
      tooltip.removeClass("hidden");
    });
  });

  $(".plyr__progress").each((i, el) => {
    const input = $(el).children('input[type="range"]');
    const tooltip = $(el).find(".plyr__tooltip");

    $(window).on("keydown", (e) => {
      if (e.originalEvent.code === "Escape") {
        tooltip.addClass("hidden");
      }
    });

    input.on("focus", (e) => {
      tooltip.removeClass("hidden");
    });

    input.on("mouseover", (e) => {
      tooltip.removeClass("hidden");
    });
  });

  $(".modal-footer .fusion-button").each((i, el) => {
    $(el).attr({
      role: "button",
      tabindex: "0",
    });

    $(el).on("keydown", (e) => {
      if (e.code === "Enter") {
        $(e.target).trigger("click");
      }
    });
  });

  // Keyboard: Home: The focus is not placed on top of the page
  $(".fusion-top-top-link").on("click", (e) => {
    e.preventDefault();
    $(".fusion-header a.fusion-logo-link").focus();
  });

  // 	Keyboard: About Us: The focus is not trapped inside the 'Settings' list
  $(".plyr__menu .plyr__menu__container div[id^='plyr-settings']").each(
    (i, el) => {
      const classObserver = new MutationObserver((mutationList) => {
        for (const mutation of mutationList) {
          if (mutation.target.hasAttribute("hidden")) {
            $(mutation.target)
              .parent()
              .find('div[id^="plyr-settings"][id$="home"]')
              .find('button[data-plyr="settings"]')
              .get(i - 1)
              .focus();
            continue;
          }

          const focusableElements = $(mutation.target).find(focusableSelector);

          focusableElements.last().on("keydown", (e) => {
            if (e.originalEvent.code === "Tab" && !e.originalEvent.shiftKey) {
              e.preventDefault();
              focusableElements.first().focus();
            }
          });

          focusableElements.first().on("keydown", (e) => {
            if (e.originalEvent.code === "Tab" && e.originalEvent.shiftKey) {
              e.preventDefault();
              focusableElements.last().focus();
            }
          });
        }
      });

      classObserver.observe(el, {
        attributes: true,
        attributeFilter: ["hidden"],
      });
    }
  );
};

function trapFocus(element) {
  const $ = jQuery;

  const focusableElements = $(element).find(focusableSelector);

  focusableElements.last().on("keydown", (e) => {
    if (e.originalEvent.code === "Tab" && !e.originalEvent.shiftKey) {
      e.preventDefault();
      focusableElements.first().focus();
    }
  });

  focusableElements.first().on("keydown", (e) => {
    if (e.originalEvent.code === "Tab" && e.originalEvent.shiftKey) {
      e.preventDefault();
      focusableElements.last().focus();
    }
  });
}

function announceToScreenReader(text, role) {
  const liveElement = document.querySelector(".live-status-region");
  const paraElement = document.createElement("p");
  const textElement = document.createTextNode(text);

  liveElement.setAttribute("role", role === undefined ? "status" : role);
  paraElement.appendChild(textElement);
  liveElement.appendChild(paraElement);

  setTimeout(() => {
    liveElement.innerHTML = "";
    liveElement.setAttribute("role", "status");
  }, 1000);
}

function capitalize(string) {
  return string
    .split(" ")
    .map(function (word) {
      return word
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : "";
    })
    .join(" ")
    .trim();
}

function randomId(length = 10) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

jQuery(document).ready(a11yOnReady(jQuery));
jQuery(window).load(a11yOnLoad(jQuery));
