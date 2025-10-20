export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          {/* 著作権表示 */}
          <div className="text-sm text-gray-500">
            &copy; {currentYear} AI日記. All rights reserved.
          </div>

          {/* リンク */}
          <div className="flex space-x-6 text-sm text-gray-500">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700"
            >
              GitHub
            </a>
            <a
              href="/privacy"
              className="hover:text-gray-700"
            >
              プライバシーポリシー
            </a>
            <a
              href="/terms"
              className="hover:text-gray-700"
            >
              利用規約
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
