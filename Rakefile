task :build do
  files = Rake::FileList["src/**/*.js"]

  # modules.js must always come first in the list
  files = files.to_a.sort_by { |f| (f =~ /modules.js/) ? "a#{f}" : "z#{f}" }

  File.open("scruffy-labrador.js", "w") do |out|
    files.each do |file|
      out.puts "// == #{file} =="
      out.puts File.read(file)
      out.puts
    end
  end
end
