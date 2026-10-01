const initialPosts = [
  { category: '기초·질문', title: '아크 용접 처음 배울 때, 뭐부터 시작하면 좋을까요?', comments: 8, author: '첫불꽃', time: '방금 전', popular: 98 },
  { category: '장비·재료', title: '초보 보안면 고르는 기준이 궁금해요', comments: 12, author: '도구쟁이', time: '12분 전', popular: 86 },
  { category: '현장 이야기', title: '첫 실습을 마쳤어요! 생각보다 어려웠던 점', comments: 6, author: '한땀씩', time: '35분 전', popular: 71 },
  { category: '안전', title: '작업장 환기, 다들 어떤 점을 확인하시나요?', comments: 4, author: '안전제일', time: '1시간 전', popular: 64 },
  { category: '기초·질문', title: 'MIG와 TIG 용접의 차이를 쉽게 설명해 주세요', comments: 9, author: '궁금한용접', time: '2시간 전', popular: 58 },
  { category: '장비·재료', title: '용접 장갑 사이즈 선택 팁 공유합니다', comments: 3, author: '현장고수', time: '3시간 전', popular: 42 },
  { category: '현장 이야기', title: '오늘 배운 비드 연습 기록 ✍️', comments: 5, author: '천천히가자', time: '4시간 전', popular: 39 },
  { category: '안전', title: '용접 전에 주변 가연물을 확인하는 습관', comments: 2, author: '불꽃지킴이', time: '5시간 전', popular: 34 },
  { category: '기초·질문', title: '용접을 배우려면 어떤 교육부터 찾아보면 될까요?', comments: 7, author: '새내기', time: '어제', popular: 31 },
  { category: '장비·재료', title: '모재와 용가재, 용어부터 헷갈려요', comments: 3, author: '금속초보', time: '어제', popular: 27 },
  { category: '현장 이야기', title: '선배님들이 알려주신 기본 자세 메모', comments: 4, author: '배우는중', time: '어제', popular: 22 },
  { category: '안전', title: '보안면과 보안경, 함께 착용해야 하나요?', comments: 6, author: '마당지기', time: '어제', popular: 18 },
  { category: '자격증', title: '공조냉동기계기능사 필기 합격 후기와 오답 노트 공부법', comments: 5, author: '냉동새내기', time: '어제', popular: 16, content: '과목별 기출문제를 풀고 틀린 문제는 관련 개념을 찾아 짧게 정리하는 방식으로 준비했어요. 반복해서 틀리는 부분을 주말마다 다시 확인한 게 도움이 됐습니다. 다른 분들의 필기·실기 공부 순서와 합격 경험도 함께 나눠주세요.' },
  { category: '자격증', title: '에너지관리기능사 실기, 합격까지 연습한 과정 공유', comments: 3, author: '보일러공부중', time: '어제', popular: 14, content: '실기 준비 기간에는 작업 순서와 연습 시간을 매번 기록하고, 익숙하지 않은 부분을 따로 반복했어요. 교육기관 실습과 공개된 시험 안내를 참고했습니다. 시험 전 점검 방법이나 준비 과정에서 얻은 팁을 공유해 주세요.' },
  { category: '자격증', title: '산업안전 분야 자격증 필기 공부와 응시 조건 확인 후기', comments: 2, author: '안전공부', time: '어제', popular: 12, content: '먼저 관심 있는 산업안전 종목의 응시 자격과 시험 과목을 공식 안내에서 확인하고, 과목별로 학습 계획을 세웠어요. 산업안전 분야는 종목마다 응시 조건이 다를 수 있으니 큐넷(Q-Net)에서 최신 내용을 확인하고 공부 경험도 함께 나눠요.' },
  { category: '자격증', title: '용접기능사 실기 합격 후기, 연습할 때 점검한 것들', comments: 7, author: '비드연습생', time: '어제', popular: 20, content: '시험 과제와 공개된 출제 기준을 확인한 뒤 교육 환경에서 반복 연습하고, 매번 작업 순서와 결과를 기록했어요. 시험장 준비물과 안전 수칙을 미리 확인한 것도 도움이 됐습니다. 다른 분들의 용접기능사 공부법과 합격 과정도 들려주세요.' },
];

let posts = [...initialPosts];
const isStandaloneBoard = document.body.dataset.page === 'community';
const boardType = new URLSearchParams(window.location.search).get('board') === 'certifications' ? 'certifications' : 'welding';
const requestedCategory = new URLSearchParams(window.location.search).get('category');
let activeCategory = isStandaloneBoard && boardType === 'welding' && requestedCategory ? requestedCategory : '전체';
let searchTerm = '';
let expanded = false;
let selectedPost = null;

const postList = document.querySelector('#post-list');
const emptyState = document.querySelector('#empty-state');
const postCount = document.querySelector('#post-count');
const loadMoreButton = document.querySelector('#load-more');
const searchInput = document.querySelector('#search-input');
const composeDialog = document.querySelector('#compose-dialog');
const composeForm = document.querySelector('#compose-form');
const detailDialog = document.querySelector('#detail-dialog');
const commentsList = document.querySelector('#comments-list');
const commentForm = document.querySelector('#comment-form');

function renderPosts() {
  const filtered = posts.filter((post) => {
    const matchesBoard = !isStandaloneBoard
      || (boardType === 'certifications' ? post.category === '자격증' : post.category !== '자격증');
    const matchesCategory = activeCategory === '전체'
      || (isStandaloneBoard && boardType === 'certifications'
        ? `${post.title} ${post.content || ''}`.includes(activeCategory)
        : post.category === activeCategory);
    const text = `${post.title} ${post.category} ${post.author} ${post.content || ''}`.toLocaleLowerCase('ko');
    return matchesBoard && matchesCategory && text.includes(searchTerm.toLocaleLowerCase('ko'));
  });
  const visiblePosts = expanded ? filtered : filtered.slice(0, 8);
  postList.innerHTML = visiblePosts.map((post) => `
    <article class="post-row">
      <span class="post-category" data-kind="${escapeHTML(post.category)}"><i class="category-dot" aria-hidden="true"></i>${escapeHTML(post.category)}</span>
      <a class="post-title" href="#post-${escapeHTML(post.title)}" data-post-title="${escapeHTML(post.title)}">${escapeHTML(post.title)}<span class="post-comments">[${post.comments}]</span></a>
      <span class="post-author">${escapeHTML(post.author)}</span>
      <time class="post-meta">${escapeHTML(post.time)}</time>
    </article>
  `).join('');
  emptyState.hidden = visiblePosts.length > 0;
  loadMoreButton.hidden = filtered.length <= visiblePosts.length;
  postCount.textContent = String(filtered.length).padStart(2, '0');
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function getPostBody(post) {
  if (post.content) return post.content;
  const descriptions = {
    '기초·질문': '용접을 배우면서 궁금했던 점을 함께 나누고 싶어요. 경험이 있으신 분들의 조언을 부탁드립니다. 처음 시작하는 분들에게도 도움이 되는 이야기라면 편하게 댓글로 알려주세요.',
    '장비·재료': '사용해 보신 장비나 재료에 대한 경험을 공유해 주세요. 제품을 선택할 때 확인하면 좋은 점도 함께 나누면 큰 도움이 될 것 같아요.',
    '현장 이야기': '오늘의 작업과 배움에서 기억하고 싶은 내용을 기록해 봅니다. 각자의 현장 경험과 느낀 점을 댓글로 나눠주세요.',
    '안전': '안전한 작업 환경을 만들기 위해 무엇을 확인하면 좋을지 이야기 나누고 싶어요. 현장의 안전 수칙과 경험을 댓글로 공유해 주세요.',
    '자격증': '용접과 함께 준비하는 자격증의 공부 방법, 실기 연습 과정, 시험 준비 경험을 나눠보세요. 종목과 응시 조건은 달라질 수 있으니 최신 공식 안내도 함께 확인해 주세요.',
  };
  return descriptions[post.category] || '용접에 관한 이야기를 나눠보세요.';
}

function renderComments(post) {
  const replies = post.replies || [];
  document.querySelector('#detail-comment-count').textContent = `${post.comments}개`;
  if (replies.length === 0) {
    commentsList.innerHTML = '<p class="no-comments">아직 댓글이 없어요. 첫 댓글을 남겨보세요!</p>';
    return;
  }
  commentsList.innerHTML = replies.map((reply) => `
    <article class="comment-item">
      <div class="comment-avatar" aria-hidden="true">${escapeHTML(reply.author.slice(0, 1))}</div>
      <div class="comment-copy"><div class="comment-byline"><strong>${escapeHTML(reply.author)}</strong><time>${escapeHTML(reply.time)}</time></div><p>${escapeHTML(reply.text)}</p></div>
    </article>
  `).join('');
}

function openPost(post) {
  selectedPost = post;
  if (!post.replies && post.comments > 0) {
    post.replies = [{
      author: '마당친구',
      text: post.category === '자격증'
        ? '준비 경험을 나눠주셔서 감사해요. 응시 자격과 최신 시험 정보도 공식 안내에서 함께 확인해요!'
        : '좋은 주제네요. 안전을 먼저 챙기면서 서로의 경험을 나눠봐요!',
      time: '최근 댓글',
    }];
  }
  document.querySelector('#detail-category').textContent = post.category;
  document.querySelector('#detail-title').textContent = post.title;
  document.querySelector('#detail-author').textContent = post.author;
  document.querySelector('#detail-time').textContent = post.time;
  document.querySelector('#detail-body').textContent = getPostBody(post);
  renderComments(post);
  detailDialog.showModal();
}

function setCategory(category) {
  activeCategory = category;
  expanded = false;
  document.querySelectorAll('.category-tab').forEach((tab) => {
    const selected = tab.dataset.category === category;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
  });
  renderPosts();
}

function setupStandaloneBoard() {
  if (!isStandaloneBoard) return;
  const tabs = document.querySelector('#category-tabs');
  const categories = boardType === 'certifications'
    ? ['전체', '공조냉동', '에너지관리', '산업안전', '용접기능사']
    : ['전체', '기초·질문', '장비·재료', '현장 이야기', '안전'];
  tabs.innerHTML = categories.map((category, index) => `
    <button class="category-tab${category === activeCategory ? ' active' : ''}" type="button" role="tab" aria-selected="${category === activeCategory}" data-category="${escapeHTML(category)}">${index === 0 ? (boardType === 'certifications' ? '전체 자격증' : '전체글') : escapeHTML(category)}</button>
  `).join('');

  const isCertifications = boardType === 'certifications';
  const pageTitle = isCertifications ? '자격증 게시판' : '용접 커뮤니티';
  document.title = `${pageTitle} — 용접마당`;
  document.querySelector('#page-title').textContent = pageTitle;
  document.querySelector('#page-breadcrumb-title').textContent = pageTitle;
  document.querySelector('#page-kicker').textContent = isCertifications ? 'CERTIFICATION STORIES' : 'WELDING COMMUNITY';
  document.querySelector('#page-description').textContent = isCertifications
    ? '용접과 함께 준비하는 기능사·산업안전 자격증의 공부법과 합격 경험을 나눠요.'
    : '기초 질문부터 장비와 현장 이야기까지, 용접 경험을 함께 나눠요.';
  document.querySelector('#board-kicker').textContent = isCertifications ? 'CERTIFICATION BOARD' : 'WELDING COMMUNITY BOARD';
  document.querySelector('#board-title').childNodes[0].textContent = isCertifications ? '자격증 준비 이야기 ' : '용접 이야기 ';
  document.querySelectorAll('.main-nav .nav-link').forEach((link) => {
    const isCurrent = isCertifications
      ? link.href.includes('board=certifications')
      : link.href.includes('board=welding') && !link.href.includes('category=');
    link.classList.toggle('active', isCurrent);
  });
  document.querySelectorAll('#compose-category option').forEach((option) => {
    option.hidden = isCertifications ? option.value !== '자격증' : option.value === '자격증';
  });
  document.querySelector('#compose-category').value = isCertifications ? '자격증' : '기초·질문';
}

document.querySelectorAll('.category-tab').forEach((tab) => {
  tab.addEventListener('click', () => setCategory(tab.dataset.category));
});

document.querySelector('#category-tabs')?.addEventListener('click', (event) => {
  const tab = event.target.closest('.category-tab');
  if (tab) setCategory(tab.dataset.category);
});

document.querySelectorAll('[data-nav-category]').forEach((link) => {
  link.addEventListener('click', () => setCategory(link.dataset.navCategory));
});

document.querySelectorAll('[data-category-link]').forEach((link) => {
  link.addEventListener('click', () => setCategory(link.dataset.categoryLink));
});

document.querySelector('#search-form').addEventListener('submit', (event) => {
  event.preventDefault();
  searchTerm = searchInput.value.trim();
  expanded = false;
  renderPosts();
  document.querySelector('#board').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelector('#load-more').addEventListener('click', () => {
  expanded = true;
  renderPosts();
});

document.querySelector('#write-button').addEventListener('click', () => {
  if (isStandaloneBoard) {
    document.querySelector('#compose-category').value = boardType === 'certifications' ? '자격증' : '기초·질문';
  }
  composeDialog.showModal();
});
document.querySelector('#close-dialog').addEventListener('click', () => composeDialog.close());
document.querySelector('#cancel-compose').addEventListener('click', () => composeDialog.close());
composeDialog.addEventListener('click', (event) => {
  if (event.target === composeDialog) composeDialog.close();
});

composeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!composeForm.reportValidity()) return;
  const formData = new FormData(composeForm);
  posts.unshift({
    category: formData.get('category'),
    title: String(formData.get('title')).trim(),
    comments: 0,
    author: '마당친구',
    time: '방금 전',
    popular: 0,
    content: String(formData.get('content')).trim(),
    replies: [],
  });
  composeForm.reset();
  composeDialog.close();
  searchInput.value = '';
  searchTerm = '';
  setCategory('전체');
  document.querySelector('#board').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelectorAll('[data-search-link]').forEach((link) => {
  link.addEventListener('click', () => {
    searchInput.value = link.dataset.searchLink;
    searchTerm = link.dataset.searchLink;
    setCategory('전체');
  });
});

postList.addEventListener('click', (event) => {
  const titleLink = event.target.closest('[data-post-title]');
  if (!titleLink) return;
  event.preventDefault();
  const post = posts.find((item) => item.title === titleLink.dataset.postTitle);
  if (post) openPost(post);
});

document.querySelector('#close-detail').addEventListener('click', () => detailDialog.close());
detailDialog.addEventListener('click', (event) => {
  if (event.target === detailDialog) detailDialog.close();
});

commentForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!selectedPost || !commentForm.reportValidity()) return;
  const input = document.querySelector('#comment-input');
  const text = input.value.trim();
  if (!text) return;
  selectedPost.replies ||= [];
  selectedPost.replies.push({ author: '마당친구', text, time: '방금 전' });
  selectedPost.comments += 1;
  input.value = '';
  renderComments(selectedPost);
  renderPosts();
});

const themeToggle = document.querySelector('#theme-toggle');
function applyTheme(isDark) {
  document.body.classList.toggle('dark-mode', isDark);
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.setAttribute('aria-label', isDark ? '라이트모드 켜기' : '다크모드 켜기');
  themeToggle.querySelector('.theme-icon').textContent = isDark ? '☀' : '☾';
  themeToggle.querySelector('.theme-label').textContent = isDark ? '라이트모드' : '다크모드';
}

let savedDarkMode = false;
try {
  savedDarkMode = localStorage.getItem('welding-madang-theme') === 'dark';
} catch {
  savedDarkMode = false;
}
applyTheme(savedDarkMode);
themeToggle.addEventListener('click', () => {
  const isDark = !document.body.classList.contains('dark-mode');
  applyTheme(isDark);
  try {
    localStorage.setItem('welding-madang-theme', isDark ? 'dark' : 'light');
  } catch {
    // Theme still works for this visit when storage is unavailable.
  }
});

setupStandaloneBoard();
renderPosts();
