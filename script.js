</script><script>
// === Step definitions for progress bar ===
const STEPS = [
  { id: 'step1', num: '1', label: 'Why Bitcoin?' },
  { id: 'step2', num: '2', label: 'Basics' },
  { id: 'step3', num: '3', label: 'Performance' },
  { id: 'step4', num: '4', label: 'Institutional' },
  { id: 'step45', num: '4.5', label: 'Break' },
  { id: 'step5', num: '5', label: 'Adoption' },
  { id: 'step6', num: '6', label: 'CBDCs' },
  { id: 'step7', num: '7', label: 'Advanced' },
  { id: 'step8', num: '8', label: 'Take Action' }
];

function buildProgressBar(currentStepId) {
  const track = document.getElementById('progressTrack');
  track.innerHTML = '';
  const currentIdx = STEPS.findIndex(s => s.id === currentStepId);
  STEPS.forEach((step, i) => {
    if (i > 0) {
      const line = document.createElement('div');
      line.className = 'progress-line ' + (i <= currentIdx ? 'done' : 'pending');
      track.appendChild(line);
    }
    const node = document.createElement('div');
    node.className = 'progress-node';
    if (i < currentIdx) node.classList.add('completed');
    else if (i === currentIdx) node.classList.add('current');
    else node.classList.add('upcoming');
    const pageExists = document.getElementById('page-' + step.id);
    if (pageExists) { node.onclick = () => showPage(step.id); }
    else { node.style.cursor = 'default'; }
    if (i < currentIdx) {
      node.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>';
    } else { node.textContent = step.num; }
    const label = document.createElement('div');
    label.className = 'progress-node-label';
    label.textContent = step.label;
    node.appendChild(label);
    track.appendChild(node);
  });
}

// === Page navigation ===
function showPage(id) {
  if (id === 'home') { window.location.href = 'index.html'; return; }
  window.location.href = id + '.html';
}

// === Accordion toggle ===
function toggleStep(header) {
  const step = header.parentElement;
  const wasActive = step.classList.contains('active');
  document.querySelectorAll('.journey-step').forEach(s => s.classList.remove('active'));
  if (!wasActive) step.classList.add('active');
}

// === Tooltip/Citation popup ===
function openTooltip(data) {
  document.getElementById('tooltipStat').textContent = data.stat;
  document.getElementById('tooltipClaim').textContent = data.claim;
  document.getElementById('tooltipCitation').innerHTML = data.citation;
  const link = document.getElementById('tooltipLink');
  if (data.link) { link.href = data.link; link.style.display = 'inline-flex'; }
  else { link.style.display = 'none'; }
  document.getElementById('tooltipOverlay').classList.add('active');
}
function closeTooltip() { document.getElementById('tooltipOverlay').classList.remove('active'); }
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeTooltip(); });

// === Scroll Reveal ===
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Animate currency bars
        entry.target.querySelectorAll('.currency-bar-fill').forEach((bar, i) => {
          setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 200 + (i * 150));
        });
        // Animate counter numbers
        entry.target.querySelectorAll('.impact-number').forEach(el => {
          if (el.dataset.animated) return;
          el.dataset.animated = 'true';
          const text = el.textContent;
          const match = text.match(/^([^\d]*?)(\d+)(.*)$/);
          if (!match) return;
          const prefix = match[1], target = parseInt(match[2]), suffix = match[3];
          const duration = 1200, start = performance.now();
          function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const current = Math.round(target * eased);
            el.textContent = prefix + current + suffix;
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = text; // restore exact original
          }
          requestAnimationFrame(tick);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  reveals.forEach(el => { if (!el.classList.contains('visible')) observer.observe(el); });
}

// === Animated Hero Background ===
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, dots = [];
  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  // Create dots
  for (let i = 0; i < 60; i++) {
    dots.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5
    });
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    dots.forEach(d => {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0) d.x = w; if (d.x > w) d.x = 0;
      if (d.y < 0) d.y = h; if (d.y > h) d.y = 0;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(232, 134, 15, 0.15)';
      ctx.fill();
    });
    // Connect nearby dots
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = 'rgba(247, 147, 26, ' + (0.04 * (1 - dist / 150)) + ')';
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// === Lite YouTube Embed ===
function playYT(el) {
  const id = el.dataset.id;
  el.innerHTML = '<iframe src="https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
}

// === Masters Search Engine (Glossary) ===
const glossaryData = [
["address","A Bitcoin address looks like 1DSrfJdB2AnWaFNgSbv3MZC2m74996JafV. It consists of a string of letters and numbers. It's an encoded base58check version of a public key 160-bit hash. Just as you ask others to send an email to your email address, you would ask others to send you bitcoin to one of your Bitcoin addresses."],
["bip","Bitcoin Improvement Proposals. A set of proposals that members of the bitcoin community have submitted to improve bitcoin. For example, BIP21 is a proposal to improve the bitcoin uniform resource identifier (URI) scheme."],
["bitcoin","The name of the currency unit (the coin), the network, and the software."],
["block","A grouping of transactions, marked with a timestamp, and a commitment to the previous block. The block header is hashed to produce a proof of work, thereby validating the transactions. Valid blocks are added to the main blockchain by network consensus."],
["blockchain","A list of validated blocks, each linking to its predecessor all the way to the genesis block."],
["Byzantine Generals Problem","A reliable computer system must be able to cope with the failure of one or more of its components. A failed component may exhibit a type of behavior that is often overlooked: sending conflicting information to different parts of the system."],
["coinbase","A special field used as the sole input for coinbase transactions. The coinbase allows claiming the block reward and provides up to 100 bytes for arbitrary data. Not to be confused with Coinbase transaction."],
["coinbase transaction","The first transaction in a block. Always created by a miner, it includes a single coinbase. Not to be confused with Coinbase."],
["cold storage","Refers to keeping a reserve of bitcoin offline. Cold storage is achieved when Bitcoin private keys are created and stored in a secure offline environment. Cold storage is important for anyone with bitcoin holdings."],
["confirmations","Once a transaction is included in a block, it has one confirmation. As soon as another block is mined on the same blockchain, the transaction has two confirmations, and so on. Six or more confirmations is considered sufficient proof that a transaction cannot be reversed."],
["consensus","When several nodes, usually most nodes on the network, all have the same blocks in their locally-validated best blockchain. Not to be confused with consensus rules."],
["consensus rules","The block validation rules that full nodes follow to stay in consensus with other nodes. Not to be confused with consensus."],
["difficulty","A network-wide setting that controls how much computation is required to produce a proof of work."],
["difficulty retargeting","A network-wide recalculation of the difficulty that occurs once every 2,016 blocks and considers the hashing power of the previous 2,016 blocks."],
["difficulty target","A difficulty at which all the computation in the network will find blocks approximately every 10 minutes."],
["double-spending","Double spending is the result of successfully spending some money more than once. Bitcoin protects against double-spending by verifying each transaction added to the blockchain to ensure that the inputs for the transaction had not previously already been spent."],
["ECDSA","Elliptic Curve Digital Signature Algorithm or ECDSA is a cryptographic algorithm used by Bitcoin to ensure that funds can only be spent by their rightful owners."],
["fees","The sender of a transaction often includes a fee to the network for processing the requested transaction."],
["fork","Fork, also known as accidental fork, occurs when two or more blocks have the same block height, forking the blockchain. Typically occurs when two or more miners find blocks at nearly the same time."],
["genesis block","The first block in the blockchain, used to initialize the cryptocurrency."],
["hard fork","A permanent divergence in the blockchain, commonly occurs when non-upgraded nodes can't validate blocks created by upgraded nodes that follow newer consensus rules."],
["hardware wallet","A special type of bitcoin wallet which stores the user's private keys in a secure hardware device."],
["hash","A digital commitment to some binary input."],
["hashlocks","A type of encumbrance that restricts the spending of an output until a specified piece of data is publicly revealed. Hashlocks have the useful property that once any hashlock is opened publicly, any other hashlock secured using the same key can also be opened."],
["HD protocol","The Hierarchical Deterministic (HD) key creation and transfer protocol (BIP32), which allows creating child keys from parent keys in a hierarchy."],
["HD wallet","Wallets using the Hierarchical Deterministic (HD Protocol) key creation and transfer protocol (BIP32)."],
["HD wallet seed","A potentially-short value used as a seed to generate the master private key and master chain code for an HD wallet."],
["HTLC","A Hashed TimeLock Contract or HTLC is a class of payments that use hashlocks and timelocks to require that the receiver of a payment either acknowledge receiving the payment prior to a deadline by generating cryptographic proof of payment or forfeit the ability to claim the payment."],
["KYC","Know your customer (KYC) is the process of a business identifying and verifying the identity of its clients. The term is also used to refer to the bank regulation which governs these activities."],
["Lightning Network","A proposed implementation of Hashed Timelock Contracts (HTLCs) with bi-directional payment channels which allows payments to be securely routed across multiple peer-to-peer payment channels."],
["Lock time","The part of a transaction which indicates the earliest time or earliest block when that transaction may be added to the blockchain."],
["mempool","The bitcoin Mempool (memory pool) is a collection of all transaction data in a block that have been verified by Bitcoin nodes, but are not yet confirmed."],
["merkle root","The root node of a merkle tree, a descendant of all the hashed pairs in the tree. Block headers must include a valid merkle root descended from all transactions in that block."],
["merkle tree","A tree constructed by hashing paired data (the leaves), then pairing and hashing the results until a single hash remains, the merkle root."],
["miner","A network node that finds valid proof of work for new blocks, by repeated hashing."],
["multisignature","Multisignature (multisig) refers to requiring more than one key to authorize a bitcoin transaction."],
["network","A peer-to-peer network that propagates transactions and blocks to every Bitcoin node on the network."],
["nonce","The nonce in a bitcoin block is a 32-bit (4-byte) field whose value is set so that the hash of the block will contain a run of leading zeros."],
["offchain transactions","An offchain transaction is the movement of value outside of the blockchain. While an onchain transaction modifies the blockchain, an offchain transaction relies on other methods to record and validate the transaction."],
["opcode","Operation codes from the Bitcoin Script language which push data or perform functions within a pubkey script or signature script."],
["orphan block","Blocks whose parent block has not been processed by the local node, so they can't be fully validated yet."],
["output","An output in a transaction which contains a value field for transferring zero or more satoshis and a pubkey script for indicating what conditions must be fulfilled for those satoshis to be further spent."],
["P2PKH","Pay To PubKey Hash. An output locked by a P2PKH script can be unlocked (spent) by presenting a public key and a digital signature created by the corresponding private key."],
["P2SH","Pay-to-Script-Hash is a powerful type of transaction that greatly simplifies the use of complex transaction scripts. With P2SH the complex script is not presented in the locking script."],
["paper wallet","A document containing all of the data necessary to generate any number of Bitcoin private keys, forming a wallet of keys."],
["payment channels","A class of techniques designed to allow users to make multiple Bitcoin transactions without committing all of the transactions to the bitcoin blockchain."],
["pooled mining","A mining approach where multiple generating clients contribute to the generation of a block, and then split the block reward according to contributed processing power."],
["Proof-of-Stake","A method by which a cryptocurrency blockchain network aims to achieve distributed consensus by asking users to prove ownership of a certain amount of currency."],
["Proof-of-Work","A piece of data that requires significant computation to find. In bitcoin, miners must find a numeric solution to the SHA256 algorithm that meets a network-wide target, the difficulty target."],
["reward","An amount included in each new block as a reward by the network to the miner who found the Proof-of-Work solution."],
["satoshi","The smallest denomination of bitcoin that can be recorded on the blockchain. It is the equivalent of 0.00000001 bitcoin and is named after the creator of Bitcoin, Satoshi Nakamoto."],
["Satoshi Nakamoto","The name used by the person or people who designed Bitcoin and created its original reference implementation, Bitcoin Core. Their real identity remains unknown."],
["Script","Bitcoin uses a scripting system for transactions. Forth-like, Script is simple, stack-based, and processed from left to right. It is purposefully not Turing-complete, with no loops."],
["secret key (private key)","The secret number that unlocks bitcoin sent to the corresponding address."],
["Segregated Witness","A proposed upgrade to the Bitcoin protocol which separates signature data from bitcoin transactions."],
["SHA","The Secure Hash Algorithm or SHA is a family of cryptographic hash functions published by the National Institute of Standards and Technology (NIST)."],
["Simplified Payment Verification (SPV)","A method for verifying particular transactions were included in a block without downloading the entire block. The method is used by some lightweight Bitcoin clients."],
["soft fork","A temporary fork in the blockchain which commonly occurs when miners using non-upgraded nodes don't follow a new consensus rule their nodes don't know about."],
["timelocks","A type of encumbrance that restricts the spending of some bitcoin until a specified future time or block height. Timelocks feature prominently in many Bitcoin contracts, including payment channels and hashed timelock contracts."],
["transaction","A transfer of bitcoin from one address to another. More precisely, a signed data structure expressing a transfer of value. Transactions are transmitted over the Bitcoin network, collected by miners, and included into blocks."],
["UTXO","An unspent transaction output that can be spent as an input in a new transaction."],
["wallet","Software that holds all your Bitcoin addresses and secret keys. Use it to send, receive, and store your bitcoin."],
["Wallet Import Format (WIF)","A data interchange format designed to allow exporting and importing a single private key with a flag indicating whether or not it uses a compressed public key."]
];

function initGlossary() {
  const container = document.getElementById('glossaryContainer');
  if (!container) return;
  glossaryData.forEach(function(item) {
    var div = document.createElement('div');
    div.className = 'glossary-term';
    div.dataset.term = item[0].toLowerCase();
    div.innerHTML = '<div class="glossary-term-name">' + item[0] + '</div><div class="glossary-term-def">' + item[1] + '</div>';
    container.appendChild(div);
  });
  var searchEl = document.getElementById('glossarySearch');
  if (searchEl) { searchEl.addEventListener('input', searchGlossary); }
  searchGlossary();
}

function searchGlossary() {
  var input = document.getElementById('glossarySearch');
  var term = input ? input.value.toLowerCase().trim() : '';
  var terms = document.getElementsByClassName('glossary-term');
  var stats = document.getElementById('glossaryStats');
  var count = 0;
  Array.from(terms).forEach(function(el) {
    el.classList.remove('visible','title-match');
    el.style.order = 0;
    var idx = glossaryData.findIndex(function(g) { return g[0].toLowerCase() === el.dataset.term; });
    var name = el.dataset.term;
    var def = glossaryData[idx][1].toLowerCase();
    el.querySelector('.glossary-term-name').innerHTML = glossaryData[idx][0];
    el.querySelector('.glossary-term-def').innerHTML = glossaryData[idx][1];
    if (term === '') { el.classList.add('visible'); count++; }
    else if (name.includes(term)) {
      el.classList.add('visible','title-match');
      el.style.order = -1;
      el.querySelector('.glossary-term-name').innerHTML = highlightGlossary(glossaryData[idx][0], term);
      el.querySelector('.glossary-term-def').innerHTML = highlightGlossary(glossaryData[idx][1], term);
      count++;
    } else if (def.includes(term)) {
      el.classList.add('visible');
      el.querySelector('.glossary-term-def').innerHTML = highlightGlossary(glossaryData[idx][1], term);
      count++;
    }
  });
  if (stats) stats.textContent = term ? 'Found ' + count + ' matching terms' : 'Showing all ' + terms.length + ' terms';
}

function highlightGlossary(text, term) {
  if (!term) return text;
  var regex = new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
  return text.replace(regex, '<span class="glossary-highlight">$1</span>');
}

// === BTC Price Ticker ===
async function fetchBTCPrice() {

  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
    const data = await res.json();
    const price = data.bitcoin.usd.toLocaleString('en-US', { maximumFractionDigits: 0 });
    const change = data.bitcoin.usd_24h_change;
    const el = document.getElementById('btcPrice');
    const arrow = change >= 0 ? '▲' : '▼';
    const color = change >= 0 ? '#16a34a' : '#dc2626';
    el.innerHTML = '$' + price + ' <span style="color:' + color + '">' + arrow + ' ' + Math.abs(change).toFixed(1) + '%</span>';
  } catch(e) {
    document.getElementById('btcPrice').textContent = 'BTC';
  }
}

// === CALENDLY POPUP ===
function openCalendly() {
  if (typeof Calendly !== 'undefined') {
    Calendly.initPopupWidget({url: 'https://calendly.com/griffithsben-pm/30min'});
  } else {
    window.open('https://calendly.com/griffithsben-pm/30min', '_blank');
  }
}
function closeCalendly() { /* handled natively by Calendly widget */ }



// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
  initHeroCanvas();
  initReveal();
  initGlossary();
  fetchBTCPrice();
  setInterval(fetchBTCPrice, 60000);
  // Twitter embeds
  if (typeof twttr !== 'undefined' && twttr.widgets) { twttr.widgets.load(); }
});
