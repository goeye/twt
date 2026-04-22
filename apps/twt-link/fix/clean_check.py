from html.parser import HTMLParser

class IDChecker(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.duplicates = set()

    def handle_starttag(self, tag, attrs):
        for attr, val in attrs:
            if attr == 'id':
                if val in self.ids:
                    self.duplicates.add(val)
                self.ids.add(val)

if __name__ == "__main__":
    parser = IDChecker()
    with open('link_mobile.html', 'r', encoding='utf-8') as f:
        parser.feed(f.read())
    
    if parser.duplicates:
        print("Duplicate IDs:", parser.duplicates)
    else:
        print("No Duplicate IDs.")
