from html.parser import HTMLParser
import re

class LintParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.duplicate_ids = set()
        self.stack = []
        self.errors = []
        
    def handle_starttag(self, tag, attrs):
        if tag not in ['img', 'br', 'hr', 'input', 'meta', 'link']:
            self.stack.append((tag, self.getpos()))
            
        for attr, val in attrs:
            if attr == 'id':
                if val in self.ids:
                    self.duplicate_ids.add(val)
                self.ids.add(val)

    def handle_endtag(self, tag):
        if tag in ['img', 'br', 'hr', 'input', 'meta', 'link']:
            return
        
        while self.stack:
            last_tag, pos = self.stack.pop()
            if last_tag == tag:
                return
            else:
                self.errors.append(f"Expected </{last_tag}> (from line {pos[0]}), but found </{tag}> at line {self.getpos()[0]}")
                # We popped the last one, now continue checking if we match an earlier one
        
    def handle_data(self, data):
        pass

if __name__ == "__main__":
    parser = LintParser()
    with open('link_mobile.html', 'r', encoding='utf-8') as f:
        parser.feed(f.read())
        
    for err in parser.errors:
        print("TAG ERROR:", err)
    
    if parser.duplicate_ids:
        print("DUPLICATE IDs:", parser.duplicate_ids)
